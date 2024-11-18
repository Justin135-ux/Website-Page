import React, { useContext, useEffect, useState } from 'react';
import { IoHeartSharp } from "react-icons/io5";
import { SiSamsung,SiXiaomi,SiVivo,SiMotorola,SiOppo} from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { AiTwotonePlusSquare } from "react-icons/ai";
import Footer from "./Footer";
import axios from 'axios';
import "./Carousel.css";
import "./Home.css";
import { myContext } from './Context';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => { 
  const { products, setProducts, liked, setLiked, filterSearch, setFilterSearch, searchQuery, serverURL, cartItems, setCartItems, user } = useContext(myContext);
  // const { user, setUser } = useContext(myContext);

  const userEmail = localStorage.getItem("email");
  const userToken = localStorage.getItem("userToken");
  const [currentSlide, setCurrentSlide] = useState(0);

  
  useEffect(() => {
    const autoSlide = setInterval(() => {
      moveCarousel(1);
    }, 3000); 

    return () => clearInterval(autoSlide);
  }, [currentSlide]);

  const nav = useNavigate();

  // useEffect(() => {
    
  //   if (user && user.isBanned) {
  //     alert('Your account is banned. You cannot access this page.');
  //     nav('/banned'); 
  //   }
  // }, [user, nav]);

  const handleLikeDislike = async (product) => {
    if (!userToken || !userEmail) {
      alert("Please Login First");
      nav("/login");
      return;
  }
    try {
        const response = await axios.post("http://localhost:4000/api/user/toggleWishlist", {
            userEmail: userEmail,
            product: {
                product_id: product._id,
                name: product.name,
                image: product.image,
                price: product.price
            }
        });

        if (response.status === 200) {
            const updatedWishlist = response.data.wishlist;

            
            if (liked.some(item => item._id === product._id)) {
                setLiked(liked.filter(item => item._id !== product._id)); 
                alert("Item removed from Wishlist");
            } else {
                setLiked([...liked, product]); 
                alert("Item added to Wishlist");
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert("You are banned from modifying your wishlist.");
        } else {
            console.error("Error:", error);
            alert("An error occurred while modifying the wishlist.");
        }
    }
};

  console.log("home",products,filterSearch);

  const handleAddToCart = async (productId, stock) => {
    if (!userToken) {
      alert("Please Login First");
      nav("/login")
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
            alert("You are Banned from adding items to the Cart.");
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/product/getproduct');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const moveCarousel = (n) => {
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    setCurrentSlide((currentSlide + n + totalSlides) % totalSlides);
  };

  return (
    <div className="carousel-container">
    {/* Display home content only if the user is NOT banned */}
    {/* {user && !user.isBanned ? (
      <> */}
  <div className="logo-container">
    <img
      src="https://i.pinimg.com/564x/47/08/3c/47083c629bc2cbd102c0d023ffc15b2d.jpg"
      alt="Logo"
      className="logo"
      style={{ display: "block", margin: "0 auto", marginBottom: "0px" }}
    />
  </div>
  <div className="carousel">
    <div
      className="carousel-inner"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      <div className="carousel-item">
        <img
          src="https://www.apple.com/in/iphone-16/images/overview/welcome/hero__f4yedfen856q_xlarge.png"
          // src="https://snapcraze.co.za/wp-content/uploads/2024/01/s24-series-banner-1.jpeg"
          alt="Image 1"
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://www.techcrazy.co.nz/cdn/shop/files/15-Pro-Series-Mobile-2_293fd362-e3b4-414a-a625-b9cc12776f5f_900x.jpg?v=1705039014"
          alt="Image 2"
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://static.digit.in/18977_Samsung_Series-banners_1280X720-1.jpg"
          alt="Image 3"
        />
      </div>
      <div className="carousel-item">
        <img
          src="https://images.samsung.com/is/image/samsung/p6pim/in/feature/165609164/in-feature--nbsp-543530332?$FB_TYPE_K_JPG$"
          alt="Image 4"
        />
      </div>
    </div>
  </div>
  <div class="brand-board">
  <h2>Popular Brands</h2>
  <div className="brands">
            <SiSamsung  className="brand-icon" />
            <FaApple className="brand-icon" />
            <AiTwotonePlusSquare className="brand-icon" />
            { < SiXiaomi className="brand-icon" /> }
            { < SiVivo className="brand-icon" /> }
            { <SiMotorola className="brand-icon" /> }
            { <SiOppo className="brand-icon" /> }
          </div>
          </div>

      
      <div className="products">
        {filterSearch.map((product) => (
          <div key={product._id} className="product-item">
            <div className="product">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="product-image"
                />
              </Link>
              <div className="description">
                <p>
                  <b>{product.name}</b>
                </p>
                {/* <p>
                  <b>{product.category}</b>
                </p> */}
                <p>
                  <b>{product.brand}</b>
                </p>
                {/* <p>
                  <b>{product.size}</b>
                </p> */}
                {/* <p>
                  <b>{product.description}</b>
                </p> */}
                <p>₹{product.price}</p>
                <p>{product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}</p>
              </div>
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
              disabled={product.stock === 0}  // Disable button if stock is 0
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
            </button> */}
            <button className="addToWishlistBttn" onClick={() => handleLikeDislike(product)}>
            {liked.some(item => item._id === product._id) ? (
            <IoHeartSharp style={{ color: "red" }} />
            ) : (
            <IoHeartSharp />
            )}
           </button>
              {/* <button className="addToWishlistBttn" onClick={() => handleLike(product)}>
                {liked.some(item => item._id === product._id) ? <IoHeartSharp style={{ color: "red" }} /> : <IoHeartSharp />}
              </button> */}
            </div>
          </div>
        ))}
      </div>
      <Footer />
      {/* </>
    ) : (
     
      <p>You do not have access to this page. Contact support if you believe this is an error.</p>
    )} */}
    </div>
  );
};

export default Home;
