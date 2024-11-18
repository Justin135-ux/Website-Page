import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './ProductDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { IoHeartSharp } from 'react-icons/io5';
import { myContext } from './Context';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    liked,
    setLiked,
    cartItems,
    setCartItems,
    serverURL,
  } = useContext(myContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const userEmail = localStorage.getItem('email');
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    if (!id) {
      console.error('No product ID provided');
      setError(true);
      setLoading(false);
      return;
    }
  
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/getproductbyid/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(true);
        setLoading(false);
      }
    };
  
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async (productId, stock) => {
    if (!userToken) {
      alert("Please Login First");
    } else if (stock === 0) {  
      alert("This product is out of stock.");
    } else {
      try {
        const response = await axios.post("http://localhost:4000/api/user/addToCart", {
          productId: productId,
          userEmail: userEmail,
        });
        setCartItems(response.data);
        alert("Your Product is added to the Cart");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            alert("You are banned from adding items to the cart.");
          } else if (error.response.status === 409) {
            alert("This Item is Already in your cart");
          } else {
            console.error("Error response:", error.response);
            alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          }
        } else {
          console.error("Error:", error.message);
          alert("An error occurred while adding the product.");
        }
      }
    }
};

const isInCart = (productId) => {
  return cartItems.some(item => item.product_id === productId);
};

// const handleBuyNow = async (product) => {
//   if (!userToken) {
//     alert("Please Login First");
//     return;
//   }

//   if (product.stock === 0) {
//     alert("This product is out of stock.");
//     return;
//   }

//   // Navigate to the payment page with the product details
//   navigate('/payment', { state: { product } });
// };
  

//   try {
//     const response = await axios.post("http://localhost:4000/api/user/buyNow", {
//       productId: product._id,
//       userEmail: userEmail,
//       address: address,
//       paymentMethod: paymentMethod,
//     });

//     alert('Order placed successfully!');
//     navigate('/orders'); // Redirect to orders page after purchase
//   } catch (error) {
//     console.error('Error placing order:', error);
//     if (error.response) {
//       alert(`Error: ${error.response.data.message}`);
//     } else {
//       alert('An error occurred while placing the order.');
//     }
//   }
// };


//   const handleLike = async (product) => {
//     try {
//       if (liked.some(item => item._id === product._id)) {
//         await axios.post("http://localhost:4000/api/user/removeFromWishlist", {
//           userEmail: userEmail,
//           productId: product._id
//         });
//         setLiked(liked.filter(item => item._id !== product._id));
//         alert("Item removed from Wishlist");
//       } else {
//         await axios.post("http://localhost:4000/api/user/addToWishlist", {
//           userEmail: userEmail,
//           product: {
//             product_id: product._id,
//             name: product.name,
//             image: product.image,
//             price: product.price
//           }
//         });
//         setLiked([...liked, product]);
//         alert("Item added to Wishlist");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         alert("You are banned from adding items to the wishlist.");
//       } else if (error.response && error.response.status === 409) {
//         alert("This Item is Already in your wishlist");
//       } else {
//         console.error("Error:", error);
//         alert("An error occurred.");
//       }
//     }
// };
  //   } catch (error) {
  //     alert("This Item is Already in your wishlist");
  //   }
  // };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="error">Error loading product details.</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-brand">Brand: {product.brand}</p>
          {/* <p className="product-size">Size: {product.size}</p> */}
          <p className="product-price">Price: ₹{product.price}</p>
          <p className="product-description">Description: {product.description}</p>
          <div className="product-detail-actions">
          <button
          className={`addToCartBttn ${isInCart(product._id) ? 'inCart' : ''}`}
          onClick={() => handleAddToCart(product._id, product.stock)}
          disabled={product.stock === 0}
          style={{
          backgroundColor: isInCart(product._id) ? '#4CAF50' : '',
          color: isInCart(product._id) ? 'white' : '',
          }}
          >
          {product.stock === 0 ? 'Out of Stock' : isInCart(product._id) ? 'In Cart' : 'Add To Cart'}
          </button>
          {/* <button
          className="addToCartBttn"
          onClick={() => handleAddToCart(product._id, product.stock)}  // Pass stock value here
          disabled={product.stock === 0}  
          >
          {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
          </button> */}
            {/* <button className="wishlist-button" onClick={() => handleLike(product)}>
              {liked.some((item) => item._id === product._id) ? (
                <IoHeartSharp style={{ color: 'red' }} />
              ) : (
                <IoHeartSharp />
              )}
            </button> */}
            {/* <button
            className="buyNowButton"
            onClick={() => handleBuyNow(product)} 
            >
            Buy Now
           </button> */}

          {/* <button
            onClick={() => {
              // checkout();
              navigate("/payment");
            }}
          >
            Buy Now
          </button> */}
          {/* <button
          onClick={() => handleBuyNow(product)}
          className="buyNowButton"
          >
          Buy Now
          </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
