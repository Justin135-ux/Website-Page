const express = require("express")
const router = express.Router()

const productController=require("../controller/productController")

router.post("/addproduct",productController.addProduct)

router.get("/getproduct",productController.getProduct)

router.put("/:id",productController.updateProduct)

router.delete("/:id",productController.deleteProduct)

router.get("/getproductbyid/:id",productController.getProductById)

// router.get("/getUserById/:id",productController.getUserById)


// router.get('/getproduct/:id', getProductById);

// router.get("/brands",productController.brands)

// router.get("/brand/:brand",productController.brand)

module.exports=router