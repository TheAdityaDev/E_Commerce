const express = require('express');
const router = express.Router();
const aiController = require('../controller/ai.controller');

router.post('/fusion', aiController.fusion);

router.get("/proxy-image", async (req, res) => {
  try {
    const url = req.query.url;

    const resp = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/*",
      },
    });

    res.set("Content-Type", resp.headers["content-type"]);
    res.send(resp.data);
  } catch (e) {
    res.status(500).send("Failed");
  }
});



module.exports = router;
