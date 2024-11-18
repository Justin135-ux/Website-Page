import React, { useContext, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";
// import cardSwipeVideo from "../components/assets/card-swipe.mp4"; 
import { myContext } from "./Context";
import { FaPaypal, FaCcVisa, FaCcMastercard, FaApplePay } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    upiId: "",
    bankName: "",
    accountNumber: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const { cartItems, setCartItems } = useContext(myContext);
  const [loading, setLoading] = useState(false);
  const userEmail = localStorage.getItem("email");

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.zipCode || (paymentMethod === "Credit Card" && (!formData.cardNumber || !formData.expiryDate || !formData.cvv))) {
      alert("Please fill in all the fields.");
      return;
    }

    // Validating Credit Card inputs
    if (paymentMethod === "Credit Card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        alert("Invalid card number. Please enter a 16-digit card number.");
        return;
      }
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        alert("Invalid CVV. Please enter a 3 or 4-digit CVV.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        alert("Invalid expiry date. Please use the MM/YY format.");
        return;
      }
    }

    // Checking if cart is empty
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    

    setIsProcessing(true);

    try {
      const orderDetails = { paymentMethod };
      const addressInfo = { ...formData };
      
      console.log("Cart Items:", cartItems);
      
      const response = await axios.post(`http://localhost:4000/api/user/placeOrder/${userEmail}`, {
        items: cartItems,
        orderDetails,
        address: addressInfo
      });
      
      console.log("Order Response:", response.data);

      setIsCompleted(true);

      setTimeout(() => {
        alert("Payment successful! Order placed successfully.");
        setCartItems([]);
        navigate("/orders");
      }, 2000);

    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      {!isProcessing && !isCompleted && (
        <div className="payment-form">
          <div className="payment-section">
            <h2>Billing Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          {paymentMethod === "Credit Card" && (
            <div className="payment-section">
              <h2>Payment Information</h2>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {paymentMethod === "UPI" && (
            <div className="payment-section">
              <h2>UPI Payment Information</h2>
              <input
                type="text"
                name="upiId"
                placeholder="UPI ID"
                value={formData.upiId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {paymentMethod === "NetBanking" && (
            <div className="payment-section">
              <h2>NetBanking Information</h2>
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <div className="brands">
              <FaCcVisa className="brand-icon" />
              <FaCcMastercard className="brand-icon" />
              <FaApplePay className="brand-icon" />
              <FaPaypal className="brand-icon" />
            </div>
            <div className="payment-methods-radio">
              <label>
                <input
                  type="radio"
                  value="Credit Card"
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  value="Apple Pay"
                  checked={paymentMethod === "Apple Pay"}
                  onChange={() => setPaymentMethod("Apple Pay")}
                />
                Apple Pay
              </label>
              <label>
                <input
                  type="radio"
                  value="NetBanking"
                  checked={paymentMethod === "NetBanking"}
                  onChange={() => setPaymentMethod("NetBanking")}
                />
                NetBanking
              </label>
            </div>
          </div>
          <button onClick={handlePayment} className="pay-button">
            Complete Payment
          </button>
        </div>
      )}
      {isProcessing && (
        <div className="processing-animation">
          {/* <video src={cardSwipeVideo} autoPlay loop muted /> */}
          <p>Processing Payment...</p>
        </div>
      )}
      {isCompleted && (
        <div className="payment-success">
          <p>Payment Completed Successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;


// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./PaymentPage.css";
// import { myContext } from "./Context"; 

// const PaymentPage = () => {
//   const navigate = useNavigate();
  
//   const [paymentMethod, setPaymentMethod] = useState("Credit Card"); 
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [zipCode, setZipCode] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCompleted, setIsCompleted] = useState(false);
  
//   const { cartItems } = useContext(myContext);

//   const handlePayment = async () => {
    
//     if (!name || !email || !phone || !address || !zipCode || (paymentMethod === "Credit Card" && (!cardNumber || !expiryDate || !cvv))) {
//       alert("Please fill in all the fields.");
//       return;
//     }

    
//     if (paymentMethod === "Credit Card") {
//       if (!/^\d{16}$/.test(cardNumber)) {
//         alert("Invalid card number. Please enter a 16-digit card number.");
//         return;
//       }

//       if (!/^\d{3,4}$/.test(cvv)) {
//         alert("Invalid CVV. Please enter a 3 or 4-digit CVV.");
//         return;
//       }

//       if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
//         alert("Invalid expiry date. Please use the MM/YY format.");
//         return;
//       }
//     }

    
//     if (!cartItems || cartItems.length === 0) {
//       alert("Your cart is empty.");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const orderDetails = { paymentMethod };
//       const userEmail = localStorage.getItem("email");
//       const addressInfo = { name, phone, email, address, zipCode };

      
//       console.log("Cart Items:", cartItems);

      
//       const response = await axios.post(`http://localhost:4000/api/user/placeOrder/${userEmail}`, {
//         items: cartItems, 
//         orderDetails,
//         address: addressInfo,
//       });

      
//       console.log("Order Response:", response.data);

      
//       setIsCompleted(true);

//       setTimeout(() => {
//         alert("Payment successful! Order placed successfully.");
//         navigate("/orders");
//       }, 2000);

//     } catch (error) {
//       console.error("Failed to place order", error);
//       alert("Failed to place order");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="payment-page">
//       <h1>Payment Details</h1>
//       {!isProcessing && !isCompleted && (
//         <div className="payment-form">
//           <div className="payment-section">
//             <h2>Billing Information</h2>
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Zip Code"
//               value={zipCode}
//               onChange={(e) => setZipCode(e.target.value)}
//               required
//             />
//           </div>

//           <div className="payment-section">
//             <h2>Payment Method</h2>
//             <div className="payment-method-options">
//               <label>
//                 <input
//                   type="radio"
//                   value="Credit Card"
//                   checked={paymentMethod === "Credit Card"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 Credit Card
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   value="PayPal"
//                   checked={paymentMethod === "PayPal"}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 PayPal
//               </label>
//             </div>
//           </div>

//           {paymentMethod === "Credit Card" && (
//             <div className="payment-section">
//               <h2>Credit Card Information</h2>
//               <input
//                 type="text"
//                 placeholder="Card Number"
//                 value={cardNumber}
//                 onChange={(e) => setCardNumber(e.target.value)}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Expiry Date (MM/YY)"
//                 value={expiryDate}
//                 onChange={(e) => setExpiryDate(e.target.value)}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="CVV"
//                 value={cvv}
//                 onChange={(e) => setCvv(e.target.value)}
//                 required
//               />
//             </div>
//           )}

//           <button onClick={handlePayment} className="pay-button">
//             Complete Payment
//           </button>
//         </div>
//       )}

//       {isCompleted && (
//         <div className="payment-success">
//           <p>Payment Completed Successfully!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;
