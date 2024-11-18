import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css"; 

function ForgotPassword({ toggleForgotPassword }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const serverURL = 'http://localhost:5550'; // Updated to the correct server URL

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`http://localhost:4000/api/user/userForgotPassword`, { email });
      setLoading(false);
      
      if (response.data.success) {
        setMessage("Password reset link sent successfully. Please check your email.");
        setTimeout(() => navigate("/login"), 3000); 
        toggleForgotPassword(); 
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-modal-content">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button type="button" onClick={toggleForgotPassword}>
            Cancel
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;

// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import "./ForgotPassword.css"; 

// function ForgotPassword({ toggleForgotPassword }) {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:4000/api/user/userForgotPassword", { email });
//       setMessage(response.data.message);
//       setError("");
//       toggleForgotPassword(); 
//     } catch (error) {
//       setError(error.response?.data?.error || "An error occurred.");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="forgot-password-container">
//       <div className="forgot-password-modal-content">
//         <h2>Forgot Password</h2>
//         <form onSubmit={handleForgotPassword}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="submit">Send Reset Link</button>
//           <button type="button" onClick={toggleForgotPassword}>
//             Cancel
//           </button>
//         </form>
//         {message && <p className="success-message">{message}</p>}
//         {error && <p className="error-message">{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;
