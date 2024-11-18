const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();
EMAIL_USER="justinjomy04@gmail.com"
EMAIL_PASS="nhbh fwvc gjpl yrpm"


const productSchema = new mongoose.Schema({
   name:{
    type: String,
    required: true
   },
   category:{
      type: String,
      required: true
   },
   brand:{
      type: String,
      required: true
   },
   image:{
      type: String,
      required: true
   },
   price:{
    type: Number,
    required: true
   },
   description:{
    type: String,
    required: false
   },
   stock: { 
      type: Number,
      required: true,
      default: 0,
      min: 0 
    }
   
   
});


productSchema.pre('save', async function (next) {
   const product = this;

   console.log('Checking stock for:', product.name);
   console.log('Current stock:', product.stock);
   

   if (product.isModified('stock') && product.stock <= 5) {
      console.log('stock is low, sending alert...');      
       await sendStockAlert(product); 
   }

   next();
});

async function sendStockAlert(product) {
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: EMAIL_USER,
           pass: EMAIL_PASS,
       },
   });


   const mailOptions = {
       from: EMAIL_USER,
       to: 'j30825590@gmail.com',
       subject: `Low Stock Alert: ${product.name}`,
       text: `The stock for the product "${product.name}" is low. Only ${product.stock} items left. Please restock soon.`,
       text: `http://localhost:3000/AdminProducts`
   };

   try {

       await transporter.sendMail(mailOptions);
       console.log('Stock alert email sent successfully!');
   } catch (error) {
       console.error('Error sending stock alert email:', error);
   }
}


const Product=mongoose.model("product",productSchema)

module.exports=Product
