const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../../controllers/category.controller");
const upload = require("../../middleware/upload");

const router = require("express").Router();

router.post("/addcategory", upload.single('img'),createCategory);
router.get("/allcategories", getCategories);
router.get("/singlecategory/:slug", getCategory);
router.put("/updatecategory/:id", upload.single('img'), updateCategory);
router.delete("/deletecategory/:id", deleteCategory);

module.exports = router;