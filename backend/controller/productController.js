const Product=require("../Model/productSchema")
const User = require("../Model/userSchema")
// const { sendStockAlert } = require("../utils/emailService");
// const nodemailer = require("nodemailer")
// EMAIL_USER="admin@gmail.com"
// EMAIL_PASS="admin123"

const addProduct = async (req,res)=>{
    try {
       const {name,category,brand,image,price,description,stock,} = req.body
       
       const product= new Product({name,category,brand,image,price,description,stock,})
       await product.save()
       res.status(200).send("Product  added successfully")
    } catch (error) {
       console.log(error); 
    }
}

const getProduct=async (req,res)=>{
    try {
      const product= await Product.find()
      res.status(200).json(product)
    } catch (error) {
      console.log(error);
    }
  }
  
  const updateProduct=async (req,res)=>{
    try {
      const { id } = req.params
      const {name,category,brand,image,price,description,stock,} = req.body
  
      await Product.findByIdAndUpdate(id, {name, category, brand, image, price, description, stock,},{new:true})
      res.status(200).send("updated successfully")
    } catch (error) {
      console.log(error);
    }
  }
  
  const deleteProduct=async (req,res)=>{
    try {
      const { id } = req.params
  
      await Product.findByIdAndDelete(id)
      res.status(200).send("deleted successfully")
    } catch (error) {
      console.log(error);
    }
  };

  const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).send('Internal Server Error');
    }
  };


  module.exports={addProduct,getProduct,updateProduct,deleteProduct,getProductById,}