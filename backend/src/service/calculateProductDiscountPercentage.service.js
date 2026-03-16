 const calculateProductDiscountPercentage = (mrpPrice, sellingPrice) => {
   if (mrpPrice <= 0) {
       return 0;
    //  throw new Error("MRP must be greater than Selling Price");
   }

   const discount = mrpPrice - sellingPrice;

   return Math.round((discount / mrpPrice) * 100);
 };


 module.exports =  calculateProductDiscountPercentage