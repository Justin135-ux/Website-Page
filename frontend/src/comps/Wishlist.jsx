import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { myContext } from './Context';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import { Navbar } from './Navbar';
import Footer from './Footer';
import { TiShoppingCart } from "react-icons/ti";
// import { IoHeartSharp } from "react-icons/io5";
import { IoHeartDislikeSharp } from "react-icons/io5";

const Wishlist = () => {
  const { liked, cartItems, setCartItems, setLiked, } = useContext(myContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userToken =localStorage.getItem("userToken");
  const userEmail = localStorage.getItem("email"); 

  const nav = useNavigate();

//   function handleAddToCart(product) {
//     if (cartItems.includes(product)) {
//      setCartItems(cartItems.filter(item => item._id !== product._id));
//     } else {
//   setCartItems([...cartItems, product]);
//   }
//    alert("Your Product is added to the Cart");
//  }
  
  const handleDislike = async (product) => {
    try {
      const response = await axios.delete("http://localhost:4000/api/user/removeWishlist", {
        data: { 
          userEmail: userEmail,
          productId: product._id,
        },
      });

      if (response.status === 200) {
        setLiked(liked.filter(item => item._id !== product._id));
        fetchWishlist(); 
        alert("Item removed from Wishlist");
      } else {
        alert("Failed to remove item from Wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update Wishlist");
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/user/getWishlist", {
        userEmail: userEmail,
      });
      setWishlist(response.data.wishlist);
      console.log("Wishlist fetched successfully:", response.data.wishlist);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch wishlist");
      setLoading(false);
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

return (
  <div>
      <div className="wishlist-container">
          <h1>Your Wishlist</h1>
          {loading ? (
              <p>Loading...</p>
          ) : error ? (
              <p>{error}</p>
          ) : wishlist.length > 0 ? (
              <div className="wishlist-grid">
                  {wishlist.map(product => (
                      <div className="wishlist-card" key={product._id}>
                          <img src={product.image} alt={product.name} />
                          <h3>{product.name}</h3>
                          <p><strong>Price:</strong> ₹{product.price}</p>
                          <div className="button-container">
                              {/* <button
                                  onClick={() => handleAddToCart(product)}
                                  className="icon-button">
                                  {cartItems.find(cartItem => cartItem._id === product._id) ? <TiShoppingCart style={{ color: "green" }} /> : <TiShoppingCart />}
                              </button> */}
                              <button onClick={() => handleDislike(product)}
                                      className="icon-button">
                                      <IoHeartDislikeSharp />
                              </button>
                              {/* <button
                                  onClick={() => handleLike(product)}
                                  className="icon-button">
                                  {liked.includes(product) ? <IoHeartSharp style={{ color: "red" }} /> : <IoHeartSharp />}
                              </button> */}
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <div className="wishlist-empty">
                  <p>Your wishlist is empty.</p>
                  <p>Move your liked products from the list of products to the Wishlist page for easy shopping.</p>
              </div>
          )}
      </div>
      <Footer />
  </div>
);
}
export default Wishlist;
