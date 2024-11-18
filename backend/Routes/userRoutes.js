const express = require("express")
const router = express.Router()

const Controller=require("../controller/userRegister")

router.post("/adduser",Controller.createUser)

router.post("/loginuser",Controller.loginUser)

router.get("/getuser",Controller.getUser)

router.post("/addToCart",Controller.addToCart)

router.post("/getCart",Controller.getCart)

router.post("/updateCartItemQuantity",Controller.updateCartItemQuantity)

router.delete("/removeCart",Controller.removeCart)

router.post("/toggleWishlist",Controller.toggleWishlist)

router.delete("/removeWishlist",Controller.removeWishlist)

router.post("/getWishlist",Controller.getWishlist)

router.post("/placeOrder/:email",Controller.placeOrder)

// router.get("/getUserOrders/:id",Controller.getUserOrders)
router.get("/getUserOrders/:userId", Controller.getUserOrders);

router.put("/banuser/:id", Controller.banUser);

router.put("/unbanUser/:id", Controller.unbanUser);

router.delete("/deleteOrder/:orderId",Controller.deleteOrder)

router.post("/userForgotPassword",Controller.userForgotPassword)

// router.post("/userResetPassword/:id/:token",Controller.userResetPassword)

router.post("/api/user/userResetPassword/:id/:token", Controller.userResetPassword)


router.get("/getUserById/:id",Controller.getUserById)


// router.put("/:id",userRegister.updateuser)

// router.delete("/:id",userRegister.deleteuser)

module.exports=router