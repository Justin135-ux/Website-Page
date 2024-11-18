const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cart: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            name: String,
            price: Number,
            image: String,
            category: String
        }
    ],
    wishlist: [
        {
          product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } ,
          name: String,
          image: String,
          price: Number
        }
      ],
      orders: [
    {
        orderItems: [
            {
                product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                image: String,
                price: Number,
                quantity: Number,
                category: String
            }
        ],
        paymentMethod: String,
        address: {
            name: String,
            phone: String,
            email: String,
            address: String,
            zipCode: String
        },
        order_date: {
            type: Date,
            default: Date.now
        },
        totalAmount: {
            type: Number,
            required: false
        },
    }
],

    date: {
        type: Date,
        default: Date.now
    },
    address: [
        {
            house: String,
            street: String,
            city: String,
            pin: Number,
            phone: Number
        }
    ],
    isBanned: {
        type: Boolean,
        default: false,
    },
    
});


const User=mongoose.model("user",userSchema)

module.exports=User
