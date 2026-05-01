class ProductSearchService {
  constructor(productModel) {
    this.productModel = productModel;
    this.stopWords = ["for", "and", "the", "with", "a", "an"];
  }

  tokenize(query) {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(w => w && !this.stopWords.includes(w));
  }

  normalize(word) {
    const map = {
      tshirt: "t-shirt",
      tee: "t-shirt",
      denim: "jeans"
    };
    return map[word] || word;
  }

  extractFilters(tokens) {
    const filters = {};
    
    const colors = ["black", "white", "blue", "red"];
    const categories = ["t-shirt", "shirt", "jeans"];

    tokens.forEach(token => {
      if (colors.includes(token)) filters.color = token;
      if (categories.includes(token)) filters.category = token;
    });

    return filters;
  }

  async search({ query }) {
    if (!query) return [];

    // 1. Process query
    let tokens = this.tokenize(query).map(t => this.normalize(t));
    if (!tokens.length) return [];

    const filters = this.extractFilters(tokens);

    // 2. Build Mongo query
    const mongoQuery = {
      $text: { $search: tokens.join(" ") }
    };

    if (filters.color) mongoQuery.color = filters.color;
    if (filters.category) mongoQuery.category = filters.category;

    // 3. Fetch small dataset (FAST)
    let products = await this.productModel
      .find(mongoQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(30)
      .select("title description images category price color");

    // 4. Fallback (rare case)
    if (!products.length) {
      products = await this.productModel.find({
        $or: tokens.map(token => ({
          $or: [
            { title: { $regex: token, $options: "i" } },
            { description: { $regex: token, $options: "i" } }
          ]
        }))
      })
      .limit(30)
      .select("title description images category price color");
    }

    return products.slice(0, 10);
  }
}

module.exports = ProductSearchService;