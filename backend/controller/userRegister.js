const mongoose = require("mongoose")
require('dotenv').config();
const User = require("../Model/userSchema")
const Product = require("../Model/productSchema")
// const Order = require("../Model/orderSchema")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "strts65464"
// const jwtSecretKey = JWT_SECRET;
const EMAIL_USER="justinjomy04@gmail.com"
const EMAIL_PASS="nhbh fwvc gjpl yrpm"




const userForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      
      console.log("JWT_SECRET:", JWT_SECRET);
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
      console.log("Generated token for forgot password:", token);
  
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });
  
      
      const resetPasswordLink = `http://localhost:3000/user/ResetPassword/${user._id}/${token}`;
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Reset Your Password',
        text: `You requested a password reset. Please use the following link to reset your password: ${resetPasswordLink}. This link will expire in 24 hours.`
      };
  
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ success: false, message: 'Failed to send reset email' });
        }
        console.log('Password reset email sent:', info.response);
        res.json({ success: true, message: 'Password reset email sent successfully' });
      });
    } catch (error) {
      console.error('Error in forgot password process:', error);
      res.status(500).json({ success: false, message: 'An internal server error occurred' });
    }
  };

// const userResetPassword = async (req, res) => {
//     const { id, token } = req.params;  
//     const { password } = req.body;

//     try {
        
//         const decoded = jwt.verify(token, JWT_SECRET);

        
//         const user = await User.findOne({ _id: id, email: decoded.email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//         await user.save();

//         res.status(200).json({ Status: 'Success', message: 'Password reset successfully' });

//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'The reset link has expired. Please request a new one.' });
//         }
//         res.status(500).json({ message: 'An error occurred while resetting the password.' });
//     }
// };

const userResetPassword = async (req, res) => {
    console.log("Route hit, params:", req.params);
    const { id, token } = req.params;  
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        const user = await User.findOne({ _id: id, email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ Status: 'Success', message: 'Password reset successfully' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'The reset link has expired. Please request a new one.' });
        }
        res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
};




const createUser = async (req, res) => {
    

    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(409).json({ error: "Email already exists." });
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        res.send("User added successfully")
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

  
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            
            if (user.isBanned) {
                return res.status(403).json({
                    error: 'Your account has been banned. Please contact admin.',
                    success: false
                });
            }

            
            const comparePwd = await bcrypt.compare(req.body.password, user.password);

            if (comparePwd) {
                const authToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1d' });
                res.json({ success: true, authToken, user, userId: user._id });
                console.log(authToken);
            } else {
                res.status(400).json({ 
                    error: 'Incorrect password!', 
                    success: false 
                });
            }
        } else {
            res.status(404).json({ 
                error: 'User not found', 
                success: false 
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred' 
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json({ user })
    } catch (error) {
        console.log(error);
    }
}

const addToCart = async (req, res) => {
    const { userEmail, productId } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is banned
        if (user.isBanned) {
            return res.status(403).json({ message: "User is banned and cannot add items to the cart." });
        }
        // Check if user is an admin
        // if (!user.isAdmin) {
        // return res.status(403).json({ message: "Permission denied. Admin access required." });
        // }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product is in stock
        if (product.stock <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        const existingItem = user.cart.find(item => item.product_id.equals(productId));

        if (existingItem) {
            return res.status(409).json({ message: "This item has already been added to your cart" });
        } else {
            // Add to the user's cart and decrease stock by 1
            user.cart.push({
                product_id: productId,
                quantity: 1,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category
            });

            // product.stock -= 1; // Reduce stock by 1
            // await product.save(); // Save product with updated stock
            if (product.stock < 5) {
               await sendStockAlert(product);
              }
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getCart = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { userEmail, productId, quantity } = req.body;

    if (!userEmail || !productId || typeof quantity !== 'number') {
        return res.status(400).json({ message: 'userEmail, productId, and quantity are required' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: userEmail, 'cart.product_id': productId },
            { $set: { 'cart.$.quantity': quantity } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User or cart item not found' });
        }

        res.status(200).json({ message: 'Cart item quantity updated', cart: user.cart });
    } catch (error) {
        console.error("Error in updateCartItemQuantity:", error); 
        res.status(500).json({ message: 'Failed to update cart item quantity', error });
    }
};
const removeCart = async (req, res) => {
    const { userEmail, productId } = req.body;

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.cart = user.cart.filter(product => product.product_id.toString() !== productId);
        await user.save();

        console.log("cart",user.cart);

        res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error in removeCart:", error);
        res.status(500).json({ message: 'Failed to remove item from cart', error });
    }
};

const toggleWishlist = async (req, res) => {
    const { userEmail, product } = req.body;

    if (!userEmail || !product || !product.product_id) {
        return res.status(400).json({ message: 'userEmail and product are required' });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        if (user.isBanned) {
            return res.status(403).json({ message: "User is banned and cannot modify wishlist." });
        }

        const existingItem = user.wishlist.find(item => item.product_id.equals(product.product_id));

        if (existingItem) {
            
            user.wishlist = user.wishlist.filter(item => !item.product_id.equals(product.product_id));
            await user.save();
            return res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
        } else {
            
            user.wishlist.push(product);
            await user.save();
            return res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
        }
    } catch (error) {
        console.error("Error in toggleWishlist:", error);
        res.status(500).json({ message: 'Failed to modify wishlist', error });
    }
};

const removeWishlist = async (req, res) => {
    const { userEmail, productId } = req.body;
    console.log("req.body@removewishlist",req.body);
    

    try {
        if (!userEmail || !productId) {
            return res.status(400).json({ message: 'userEmail and productId are required' });
        }

        console.log("Removing product from wishlist", { userEmail, productId });

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    
        console.log("Current wishlist:", user.wishlist);

        
        const productInWishlist = user.wishlist.find(item => item._id.toString() === productId);
        if (!productInWishlist) {
            return res.status(404).json({ message: 'Item not found in wishlist' });
        }

        user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
        await user.save();

        console.log("Updated wishlist:", user.wishlist);

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error('Error removing product from wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const getWishlist = async (req, res) => {
    const { userEmail } = req.body;

    try {
        const user = await User.findOne({ email: userEmail }).populate('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { email } = req.params;
        const { items, orderDetails, address } = req.body;

        // Validate that items are present
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in the order." });
        }

        // Fetch the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate stock for each product and update stock
        for (const item of items) {
            const product = await Product.findById(item.product_id || item._id);

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product with ID ${item.product_id}` });
            }

            
            product.stock -= item.quantity;
            await product.save();

            
            // if (product.stock < 5) {
            //     await sendStockAlert(product); 
            // }
        }

        
        const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        
        const newOrder = {
            orderItems: items.map(item => ({
                product_id: item.product_id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                category: item.category || "N/A",
            })),
            paymentMethod: orderDetails.paymentMethod,
            address,
            totalAmount,
            status: 'pending', // Status is "pending" until admin approves
            order_date: new Date(),
        };

        // Add the new order to the user's orders
        user.orders.push(newOrder);

        // Remove the purchased items from the user's cart
        user.cart = user.cart.filter(cartItem => 
            !items.some(item => item.product_id.toString() === cartItem.product_id.toString())
        );

        // Save the user document
        await user.save();

        // Return response with "Order pending" message and the new order ID
        res.status(200).json({ message: 'Order pending', orderId: newOrder._id });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
       
        const user = await User.findById(userId)
            .populate({
                path: 'orders.orderItems.product_id',  
                model: Product,
                select: 'name price image category', 
            });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const orders = user.orders;
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
       
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// const getUserOrders = async (req, res) => {
//     try {
//         // const { email: userEmail } = req.params;
//         const { userId } = req.params;

//         // const user = await User.findOne({ email: userEmail })
//           const user = await User.findById({userId});
//             .populate({
//                 path: 'orders.orderItems.product_id',
//                 model: Product,
//                 select: 'name price image category',
//             })
//             .exec();

//         if (!user) {
//             return res.status(404).send('User not found');
//         }

//         const orders = user.orders;

//         res.status(200).json(orders);
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).send('Server error');
//     }
// };


const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        
        const user = await User.findOne({ "orders._id": orderId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        user.orders = user.orders.filter(order => order._id.toString() !== orderId);
        await user.save();

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const banUser = async (req, res) => {
    const { id } = req.params;

    try {
        const bannedUser = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });  // Use isBanned instead of banned
        if (!bannedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User banned successfully', bannedUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const unbanUser = async (req, res) => {
    const { id } = req.params;

    try {
        const unbannedUser = await User.findByIdAndUpdate(id, { isBanned: false }, { new: true });  // Use isBanned instead of banned
        if (!unbannedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User unbanned successfully', unbannedUser });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


 
  const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('orders'); // Fetch only the orders field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};


  

module.exports = { createUser,loginUser,getUser,addToCart,getCart,updateCartItemQuantity,removeCart,toggleWishlist,removeWishlist,getWishlist,placeOrder,getUserOrders,deleteOrder,banUser,unbanUser,userForgotPassword,userResetPassword,getUserById }