import React, { useState, useEffect, useContext } from 'react';
import "./AdminProducts.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { myContext } from './comps/Context';


const App = () => {
  const {products, setProducts} = useContext(myContext);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  // const [newProductSize, setNewProductSize] = useState('');
  const [images, setImages] = useState("");
  const [imageURLs, setImageURLs] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('');
  const [editProductBrand, setEditProductBrand] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductStock, setEditProductStock] = useState('');
  // const [editProductSize, setEditProductSize] = useState('');
  const [editProductImage, setEditProductImage] = useState('');

  const serverURL = 'http://localhost:4000';

  const navigate=useNavigate()

  function handleUserDetail(){
    navigate("/UserDetails")
  }

  // function handleMyOrders(){
  //   navigate("/MyOrders")
  // }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/product/getproduct`);
      setProducts(response.data);

      // const imageUrls = response.data.flatMap(product =>
      //   product.imagePath ? product.imagePath.map(path => `${serverURL}/${path}`) : []
      // );
      // setImageURLs(imageUrls);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    try {

      await axios.post(`${serverURL}/api/product/addproduct`, {
        name: newProductName,
        category: newProductCategory,
        brand: newProductBrand,
        image: images,
        price: newProductPrice,
        description: newProductDescription,
        stock: newProductStock
        // size: newProductSize
        // const {name,category,image,price} = req.body
      }
      );
      alert("Product added successfully!")
      fetchProducts();
      setNewProductName('');
      setNewProductPrice('');
      setNewProductCategory('');
      setNewProductBrand('');
      setNewProductDescription('');
      setNewProductStock('');
      // setNewProductSize('');
      setImages('');

    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (event, id) => {
    event.preventDefault();
    try {
      await axios.put(`${serverURL}/api/product/${id}`, {
        name: editProductName,
        price: editProductPrice,
        category: editProductCategory,
        brand: editProductBrand,
        description: editProductDescription,
        stock: editProductStock,
        image: editProductImage

      });
      alert("Your Product is Updated");
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditProductName(product.name);
    setEditProductPrice(product.price);
    setEditProductCategory(product.category);
    setEditProductBrand(product.brand);
    setEditProductDescription(product.description);
    setEditProductStock(product.stock);
    setEditProductImage(product.image);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductName('');
    setEditProductPrice('');
    setEditProductCategory('');
    setEditProductBrand('');
    setEditProductDescription('');
    setEditProductStock('');
    setEditProductImage('');
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${serverURL}/api/product/${id}`);
      alert("Your Product is Deleted");
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  return (
    <div>
      {/* <h1>SMART TECH</h1>  */}
      <div className="app">
      <div className="addproduct">
        <button className="userdetail" onClick={handleUserDetail}>User Details</button>
        <br/>
        {/* <button className="myorders" onClick={handleMyOrders}>My Orders</button> */}
        <h2>Add New Product</h2>
        <form onSubmit={addProduct} className="prod-item">
          <div className="form-group">
            <label>Product Name:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Price:</label>
            <input
              className="input-field-layout"
              type="number"
              placeholder="Enter Product Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Category:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter Product Category"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Brand:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter Product Brand"
              value={newProductBrand}
              onChange={(e) => setNewProductBrand(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Description:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter Product Description"
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Stock:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter Product Stock"
              value={newProductStock}
              onChange={(e) => setNewProductStock(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Product Images:</label>
            <input
              className="input-field-layout"
              type="text"
              placeholder="Enter the Image URL here"
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
          </div>
          <button type="submit" className="addbtn">Add Product</button>
        </form>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            {editingProductId === product._id ? (
              <form onSubmit={(e) => updateProduct(e, product._id)}>
                <div className="form-group">
                  <label>Product Name:</label>
                  <input
                    type="text"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="edit-name"
                  />
                </div>
                <div className="form-group">
                  <label>Product Price:</label>
                  <input
                    type="number"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                    className="edit-number"
                  />
                </div>
                <div className="form-group">
                  <label>Product Category:</label>
                  <input
                    type="text"
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value)}
                    className="edit-category"
                  />
                </div>
                <div className="form-group">
                  <label>Product Brand:</label>
                  <input
                    type="text"
                    value={editProductBrand}
                    onChange={(e) => setEditProductBrand(e.target.value)}
                    className="edit-brand"
                  />
                </div>
                <div className="form-group">
                  <label>Product Description:</label>
                  <input
                    type="text"
                    value={editProductDescription}
                    onChange={(e) => setEditProductDescription(e.target.value)}
                    className="edit-description"
                  />
                </div>
                <div className="form-group">
                  <label>Product Stock:</label>
                  <input
                    type="text"
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(e.target.value)}
                    className="edit-stock"
                  />
                </div>
                <div className="form-group">
                  <label>Product Image:</label>
                  <input
                    type="text"
                    value={editProductImage}
                    onChange={(e) => setEditProductImage(e.target.value)}
                    className="edit-image"
                  />
                </div>
                <button type="submit" className="update">Update</button>
                <button type="button" className="cancel" onClick={cancelEdit}>Cancel</button>
              </form>
            ) : (
              <>
                <span className="name">Name: <b>{product.name}</b></span>
                <span className="category">Category: <b>{product.category}</b></span>
                <span className="price">Price: <b>₹{product.price}</b></span>
                <span className="brand">Brand: <b>{product.brand}</b></span>
                <span className="description">Description: <b>{product.description}</b></span>
                <span className="stock">Stock: <b>{product.stock}</b></span>
                <img src={product.image} alt={product.name} className="image" />
                <button onClick={() => startEditProduct(product)} className="edit">Edit</button>
                <button onClick={() => deleteProduct(product._id)} className="delete">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default App;