import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleLogin = () => {
    if (username === "j30825590@gmail.com" && password === "admin123") {
      alert("Welcome Admin..!")
      navigate("/adminproducts");
    } else {
      console.log("Incorrect username or password");
      alert("Incorrect username or password")
    }
    
  };
 
  // console.log("userdata",user)

  const adminEmail = "j30825590@gmail.com"
  const adminPassword = "admin123"
  
  return (
    <div className="admin-login-container">
      <h1>Admin Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p>Forgot Email and Password!</p>
    </div>
  );
}