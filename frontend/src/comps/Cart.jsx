import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { myContext } from "./Context";

export const Cart = () => {
  const { cartItems, setCartItems } = useContext(myContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userToken = localStorage.getItem("userToken");
  const userEmail = localStorage.getItem("email");

  const navigate = useNavigate();

  async function fetchCart() {
    if (!userToken) {
      alert("Please Login First");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:4000/api/user/getCart", {
        userEmail: userEmail,
      });
      const data = response.data || [];
      setCartItems(Array.isArray(data) ? data : []);
      console.log("Cart items fetched successfully:", data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error:', error.message);
        alert("An error occurred while fetching the cart.");
      }
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const calculateCartTotal = () => {
      return cartItems.reduce((total, item) => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        return total + price * quantity;
      }, 0);
    };
    setCartTotal(calculateCartTotal());
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await axios.post("http://localhost:4000/api/user/updateCartItemQuantity", {
        userEmail: userEmail,
        productId: productId,
        quantity: newQuantity
      });

      const updatedCart = cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      alert("Cart item quantity updated successfully");
    } catch (error) {
      console.error("Failed to update cart item quantity", error);
      alert("Failed to update cart item quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await axios.delete('http://localhost:4000/api/user/removeCart', {
        data: { productId: productId, userEmail: userEmail }
      });

      const data = response.data.cart || [];
      setCartItems(Array.isArray(data) ? data : []);
      alert("Your Product has been Removed from Cart...");
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      alert("Failed to remove item from cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>

      <div className="cart">
        {cartItems.length > 0 ? cartItems.map((product) => {
          return (
            <div key={product.product_id} className="cartItem">
              <img src={product.image} alt={product.name} />
              <div className="description">
                <p><b>{product.name}</b></p>
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.quantity}</p>
                <div className="countHandler">
                  <button onClick={() => handleQuantityChange(product.product_id, Math.max(1, (product.quantity || 1) - 1))}>-</button>
                  <button>{product.quantity || 1}</button>
                  <button onClick={() => handleQuantityChange(product.product_id, (product.quantity || 1) + 1)}>+</button>
                  <h4 className="product-total">Product Total: ₹{(product.price || 0) * (product.quantity || 1)}/-</h4>
                  <button className="remove" onClick={() => handleRemove(product.product_id)}>Remove</button>
                </div>
              </div>
            </div>
          );
        }) : <h1>Your Shopping Cart is Empty</h1>}
      </div>

      {cartItems.length > 0 && (
        <div className="checkmeout">
          <p>Total: ₹{cartTotal}</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
          <button
            onClick={() => {
              navigate("/payment");
            }}
          >
            CheckOut
          </button>
        </div>
      )}
    </div>
  );
};
