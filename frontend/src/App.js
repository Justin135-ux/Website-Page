import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./comps/Navbar";
import { Footer } from "./comps/Footer";
import Wishlist from "./comps/Wishlist";
import { Cart } from "./comps/Cart";
import PaymentPage from "./comps/PaymentPage";
import ProductDetails from "./comps/ProductDetails";
import ForgotPassword from "./comps/ForgotPassword";
import ResetPassword from "./comps/ResetPassword";
import Orders from "./comps/Orders";
import Home from "./comps/Home";
import Register from "./comps/Register";
import Login from "./comps/Login";
import AdminLogin from "./comps/AdminLogin";
import AdminProducts from "./AdminProducts";
// import MyOrders from "./comps/MyOrders";
import { myContext } from "./comps/Context";
import UserDetails from "./comps/UserDetails";

  function App() {
    
    const [products, setProducts] = useState([]);

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
    const [user, setUser] = useState([]);
    const [logUser, setLogUser] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [liked, setLiked] = useState([]);
    const [add, setAdd] = useState([]);
    const [filterSearch, setFilterSearch] = useState(products);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [bannedUser, setBannedUser] = useState([]);
    const userEmail = localStorage.getItem("email");

    function handleAddtoCart(product) {
         if (cartItems.includes(product)) {
          setCartItems(cartItems.filter(item => item._id !== product._id));
         } else {
       setCartItems([...cartItems, product]);
       }
        alert("Your Product is added to the Cart");
      }

    const getUserByEmail = (email) => {
      user.find((user) => user.email === email)
    }

   const values = { user, setUser, liked, setLiked, add, setAdd, logUser, setLogUser, products, setProducts,
     wishlist, setWishlist,
    cartItems, setCartItems, filterSearch, setFilterSearch, searchQuery, setSearchQuery, bannedUser, setBannedUser, getUserByEmail }
   
    useEffect(() => {
      if (products.length > 0) {
        setFilterSearch(products);
      }
    }, [products]);
    

  return (
    <div className="App">
      <Router>
        <myContext.Provider value={values}>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/user/ResetPassword/:id/:token" element={<ResetPassword />} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/payment" element={<PaymentPage />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/orders/:userId" element={<Orders />} />
        <Route path="/UserDetails" element={<UserDetails />} />
        {/* <Route path="/MyOrders" element={<MyOrders />} /> */}
        <Route path="/AdminProducts" element={<AdminProducts />} />
        </Routes>
        </myContext.Provider>
        </Router>
    
    </div>
  );

  }
export default App;