import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoLogOut, IoClose, IoMenu, IoHeartSharp } from "react-icons/io5";
import { FaShoppingBag, FaHome } from "react-icons/fa";
import { Slider, Button } from "@mui/material";
import { myContext } from "./Context";
import "./SearchBar.css";
import "./Navbar.css";

export const Navbar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { products, setFilterSearch, logUser, setLogUser } = useContext(myContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 120000]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const applyFilters = (brand, priceRange, sortOrder) => {
  const filteredProducts = products.filter((item) => {
    const { name, price: itemPrice, brand: itemBrand } = item;
    
    
    const price = Number(itemPrice);

    
    const matchesBrand = brand === "All" || itemBrand.toLowerCase() === brand.toLowerCase();

   
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || price.toString().includes(searchQuery);

    
    if (!matchesBrand) console.log(`Excluded by brand: ${item.name} (brand: ${itemBrand})`);
    if (!matchesPrice) console.log(`Excluded by price: ${item.name} (price: ${price}, range: ${priceRange})`);
    if (!matchesSearch) console.log(`Excluded by search query: ${item.name}`);

    return matchesBrand && matchesPrice && matchesSearch;
  });

  
  const sortedProducts = filteredProducts.sort((a, b) => 
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  setFilterSearch(sortedProducts);
};

  
  useEffect(() => {
    applyFilters(selectedBrand, priceRange, sortOrder);
  }, [searchQuery, products, selectedBrand, priceRange, sortOrder]);
  

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setLogUser(null);
      localStorage.removeItem("email");
      localStorage.removeItem("userToken");
      nav("/Login");
      alert("You have been logged out.");
    }
  };

  return (
    <div className="navbar">
      {location.pathname === '/' && (
        <>
        <div className="filter-container">
          <Button
            onClick={handleFilterClick}
            className={`filter-button ${sidebarOpen ? "open" : ""}`}
          >
            {sidebarOpen ? <IoClose className="filter-icon" /> : <IoMenu className="filter-icon" />}
          </Button>
        </div>
        <div className="search-container">
          <input
            className="search"
            type="text"
            placeholder="What Are You Looking For"
            value={searchQuery}
            onChange={handleSearch}
          />
          <i className="fa fa-search search-icon" aria-hidden="true"></i>
        </div>
        </>
      )}
      <div className="links">
      {location.pathname === '/' && logUser && (
          <Link to="/" className="icon-link" onClick={handleLogout}>
            <IoLogOut className="logout-icon" />
          </Link>
        )}
        {!logUser && (
          <>
            <Link to="/Login" className="icon-link">LOGIN</Link>
            <Link to="/Register" className="icon-link">SIGN UP</Link>
          </>
        )}
        {/* {logUser ? (
          <Link to="/" className="icon-link" onClick={handleLogout}>
            <IoLogOut className="logout-icon" />
          </Link>
        ) : (
          <>
            <Link to="/Login"> LOGIN </Link>
            <Link to="/Register"> SIGN UP </Link>
          </>
        )} */}
        <Link to="/">
          <FaHome className="fa-home" />
        </Link>
        {/* <Link to="/"> HOME </Link> */}
        {/* <Link to="/Cart"> CART </Link> */}
        <Link to="/cart">
          <FaShoppingBag className="fa-shopping-cart" />
        </Link>
        <Link to="/Wishlist">
          <IoHeartSharp className="io-heart-sharp" />
        </Link>
        <Link to="/orders"> MY ORDERS </Link>
        {/* <Link to="/Wishlist"> WISHLIST </Link> */}
        <div className={`filter-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="filter-options">
            <div className="filter-section">
              <h3>Brand</h3>
              <select onChange={handleBrandChange} value={selectedBrand}>
                <option value="All">All</option>
                <option value="APPLE">APPLE</option>
                <option value="MOTOROLA">MOTOROLA</option>
                <option value="SAMSUNG">SAMSUNG</option>
                <option value="OPPO">OPPO</option>
                <option value="ONEPLUS">ONEPLUS</option>
                <option value="GOOGLE">GOOGLE</option>
                <option value="IQOO">IQOO</option>
                <option value="POCO">POCO</option>
                <option value="VIVO">VIVO</option>
                <option value="XIAOMI">XIAOMI</option>
              </select>
            </div>
            <div className="filter-section">
              <h3>Price Range</h3>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={120000}
                step={100}
              />
            </div>
            <div className="filter-section">
              <h3>Sort by Price</h3>
              <select onChange={handleSortOrderChange} value={sortOrder}>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={() => setSidebarOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};
