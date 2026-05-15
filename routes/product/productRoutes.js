const router = require("express").Router();
const {
  getProducts,
  createProduct
} = require("../../controllers/productController");

router.get("/allproducts", getProducts);
router.post("/addproduct", createProduct);

module.exports = router;
