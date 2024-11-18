// import { useContext, useState } from "react";
// import axios from "axios";
// import "./Login.css";
// import { useNavigate } from "react-router-dom";
// import { myContext } from "./Context";
// import ForgotPassword from "./ForgotPassword";

// function Login() {
//   const { setLoginStatus, setLogUser } = useContext(myContext);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   const nav = useNavigate();

//   // Email validation
//   const validateEmail = () => {
//     if (!email.endsWith("@gmail.com")) {
//       setEmailError("Email must be a valid Gmail address.");
//       return false;
//     }
//     setEmailError(""); // Reset error if valid
//     return true;
//   };

//   // Password validation
//   const validatePassword = () => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
//     if (!passwordRegex.test(password)) {
//       setPasswordError(
//         "Password must contain at least one letter, one number, and be at least 6 characters long."
//       );
//       return false;
//     }
//     setPasswordError(""); // Reset error if valid
//     return true;
//   };

//   const userLoginbtn = async (e) => {
//     e.preventDefault();

//     // Validate email and password before proceeding
//     const isEmailValid = validateEmail();
//     const isPasswordValid = validatePassword();

//     // Stop the process if either validation fails
//     if (!isEmailValid || !isPasswordValid) return;

//     try {
//       const response = await axios.post(`http://localhost:4000/api/user/loginuser`, {
//         email,
//         password,
//       });

//       localStorage.setItem("userToken", response.data.authToken);
//       localStorage.setItem("userId", response.data.userId);
//       localStorage.setItem("email", email);
//       alert("Login Successfully!");
//       nav("/");

//     } catch (error) {
//       // Handle specific error responses from the backend
//       if (error.response) {
//         const errorMessage = error.response.data.error;
//         if (error.response.status === 404) {
//           setError("User not found.");
//         } else if (error.response.status === 400) {
//           setError("Incorrect password.");
//         } else if (error.response.status === 403) {
//           setError("Your account has been banned. Please contact the Admin.");
//         } else {
//           setError(errorMessage || "Error logging in. Please try again later.");
//         }
//       } else {
//         setError("Error logging in. Please try again later.");
//       }
//       console.error("Error logging in", error);
//     }
//   };

//   const toggleForgotPassword = () => {
//     setShowForgotPassword(!showForgotPassword);
//   };

//   function Register() {
//     nav("/Register");
//   }

//   return (
//     <div className="log">
//       <h1>LOG IN</h1>
//       <div className="form-container">
//         <div className="input-group">
//           <label>Email:</label>
//           <input
//             className="input-field"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           {emailError && <p className="login-error-message">{emailError}</p>}
//         </div>
//         <div className="input-group">
//           <label>Password:</label>
//           <input
//             className="input-field"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {passwordError && <p className="login-error-message">{passwordError}</p>}
//         </div>
//         <button className="loginBtn" onClick={userLoginbtn}>
//           LOGIN
//         </button>
//         <div className="forgot-password">
//           <p onClick={toggleForgotPassword}>Forgot Password?</p>
//         </div>
//       </div>
//       <div className="register-link">
//         <h2>Need an account? Sign Up first</h2>
//         <button className="registerBtn" onClick={Register}>
//           SIGNUP
//         </button>
//       </div>
//       {error && <p className="error-message">{error}</p>}
//       {showForgotPassword && (
//         <div className="forgot-password-modal">
//           <ForgotPassword toggleForgotPassword={toggleForgotPassword} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;


import { useContext, useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { myContext } from "./Context";
import ForgotPassword from "./ForgotPassword";

function Login() {
  const { setLoginStatus, setLogUser, setUser } = useContext(myContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const nav = useNavigate();

  
  const validateEmail = () => {
    if (!email.endsWith("@gmail.com")) {
      setEmailError("Email must be a valid Gmail address.");
      return false;
    }
    setEmailError(""); 
    return true;
  };

  
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one letter, one number, and be at least 6 characters long."
      );
      return false;
    }
    setPasswordError(""); 
    return true;
  };

  const userLoginbtn = async (e) => {
    e.preventDefault();

    
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
  

    try {
      const userResponse = await axios.get(`http://localhost:4000/api/user/getuser`);
      const users = userResponse.data.user;
      const userData = users.find((user) => user.email === email);

      if (!userData) {
        setError("User not found.");
        return;
      }

      if (userData.isBanned) {
        setError("Your Account has been banned. Please contact the Admin for further support.");
        return;
      }

      const response = await axios.post(`http://localhost:4000/api/user/loginuser`, {
        email,
        password,
      });
      localStorage.setItem("userToken", response.data.authToken);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", email);
      // setUser(userData);
      alert("Login Successfully!");
      nav("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error logging in. Please try again later.");
      }
      console.error("Error logging in", error);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  function Register() {
    nav("/Register");
  }

  return (
    <div className="log">
      <h1>LOG IN</h1>
      <div className="form-container">
        <div className="input-group">
          <label>Email:</label>
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="login-error-message">{emailError}</p>}
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="login-error-message">{passwordError}</p>}
        </div>
        <button className="loginBtn" onClick={userLoginbtn}>
          LOGIN
        </button>
        <div className="forgot-password">
          <p onClick={toggleForgotPassword}>Forgot Password?</p>
        </div>
      </div>
      <div className="register-link">
        <h2>Need an account? Sign Up first</h2>
        <button className="registerBtn" onClick={Register}>
          SIGNUP
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <ForgotPassword toggleForgotPassword={toggleForgotPassword} />
          {message && <p className="success-message">{message}</p>}
          {/* {error && <p className="error-message">{error}</p>} */}
        </div>
      )}
    </div>
  );
}

export default Login;

// import { useContext, useState } from "react";
// import axios from "axios";
// import "./Login.css";
// import { useNavigate } from "react-router-dom";
// import { myContext } from "./Context";
// import ForgotPassword from "./ForgotPassword";


// function Login() {
//   const { isUserAlreadyRegistered,  registeredUsers, setRegisteredUsers,  setLoginStatus, user, setLogUser,bannedUser,setBannedUser,getUserByEmail } = useContext(myContext);
  
//   const [loggedUser, setLoggedUser] = useState([]);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error,setError]=useState("");
//   const [emailerror, setEmailError] = useState("");
//   const [passworderror, setPasswordError] = useState("");
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
  
//   console.log("userdata",user)

//   const validateEmail = () => {
//     if (!email.endsWith("@gmail.com")) {
//       setEmailError("Email must be a valid Gmail address.");
//       return false;
//     }
//     setEmailError("");
//     return true;
//   };

//   const validatePassword = () => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
//     if (!passwordRegex.test(password)) {
//       setPasswordError("Password must contain at least one letter, one number, and be at least 6 characters long.");
//       return false;
//     }
//     setPasswordError("");
//     return true;
//   };

//   const nav = useNavigate();

//   const userLoginbtn = async (e) => {
//     e.preventDefault();
  
//     if (!validateEmail() || !validatePassword()) {
//         return;
//     }
  
//     try {
//       const userResponse = await axios.get(`http://localhost:4000/api/user/getuser`);
//       const users = userResponse.data.user;
//       const userData = users.find((user) => user.email === email);

//       if (!userData) {
//           setError("User not found.");
//           return;
//       }
  
//       if (userData.isBanned) {
//         setError("Your Account has been banned. Please Contact the Admin for further support.");
//         return; // Prevent further login attempt
//     }
  
//         // Proceed with login if the user is not banned
//         const response = await axios.post(`http://localhost:4000/api/user/loginuser`, { email, password });
//         localStorage.setItem("userToken", response.data.authToken);
//         localStorage.setItem("userId", response.data.userId);
//         localStorage.setItem("email", email);
//         alert("Login Successfully!");
//         nav("/");
//     } catch (error) {
//         if (error.response && error.response.data && error.response.data.error) {
//             setError(error.response.data.error);
//         } else {
//             setError("Error logging in. Please try again later.");
//         }
//         console.error("Error logging in", error);
//     }
//   };
  

// console.log("loggedUser", loggedUser);


// const toggleForgotPassword = () => {
//   setShowForgotPassword(!showForgotPassword); 
// };



//   function Register(){
//     nav("/Register")
//   }

//   return (
//     <div className="log">
//   <h1>LOG IN</h1>
//   <div className="form-container">
//     <div className="input-group">
//       <label>Email:</label>
//       <input
//         className="input-field"
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       {emailerror && <p className="login-error-message">{emailerror}</p>}
//     </div>
//     <div className="input-group">
//       <label>Password:</label>
//       <input
//         className="input-field"
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       {passworderror && <p className="login-error-message">{passworderror}</p>}
//     </div>
//     <button className="loginBtn" onClick={userLoginbtn}>LOGIN</button>
//     <div className="forgot-password">
//     <p onClick={toggleForgotPassword}>Forgot Password?</p>
//     </div>
//   </div>
//   <div className="register-link">
//     <h2>Need an account? Sign Up first</h2>
//     <button className="registerBtn" onClick={Register}>SIGNUP</button>
//   </div>
//   {error && <p className="error-message">{error}</p>}
//   {/* Forgot Password Modal */}
//   {showForgotPassword && (
//         <div className="forgot-password-modal">
//           <ForgotPassword toggleForgotPassword={toggleForgotPassword} />
//         </div>
//       )}
// </div>
// );
// }
// export default Login

