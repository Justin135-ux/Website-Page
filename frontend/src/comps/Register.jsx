import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { myContext } from './Context';
import './Register.css';


function Register() {
  const { user, setUser, registeredUsers, setRegisteredUsers, } = useContext(myContext);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");


  const nav = useNavigate();

  const serverURL = 'http://localhost:4000';


  const validateEmail = () => {
    if (!email.endsWith("@gmail.com")) {
      setEmailError("Email must be a valid Gmail address.");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must contain at least one letter, one number, and be at least 6 characters long.");
      return false;
    }
    return true;
  };

  // const serverURL = 'http://localhost:4000';

  const isUserAlreadyRegistered = () => {
    return user.find((data) => data.email === email);
  };



  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      alert("Invalid Credentials!")
      // alert("Please enter a valid email address!")
      return;
    } else {
      setEmailError("");
    }

    if (!validatePassword()) {
      setPasswordError("Password must contain at least one letter, one number, and be at least 6 characters long.");
      alert("Invalid Credentials!")
      // alert("Please enter a valid password!")
      return;
    }
    else {
      try {

        await axios.post(`${serverURL}/api/user/adduser`, {
          name: name,
          username: username,
          email: email,
          password: password,

          // const {name,category,image,price} = req.body
        }
        );
        alert("User registered successfully!")
        nav("/login")
        setName('');
        setUserName('');
        setPassword('');
        setConfirmPassword('');

      } catch (error) {
        console.error('Error adding user:', error);

        if (error.response && error.response.status === 409) {
          alert("User Email is already registered.");
          console.error("User Email is already registered.", error);
        } else {
          alert("Error registering user. Please try again later.");
          console.error("Error registering user", error);
        }
      }
    }
  };



  const adduser = async (e) => {
    e.preventDefault();
    //     if (password !== confirmPassword) {
    //         alert('Passwords do not match');
    //         return;
    //     }
    //     try {
    //         const response = await axios.post(`${serverURL}/auth/register`, { email, password });
    //         console.log('Registration successful', response.data);

    //     } catch (error) {
    //         console.error('Error registering', error);
    //     }
    // };
    // if (username === "" || email === "" || password === "") {
    //     alert("Enter valid data");
    //     return;
    // }

    // if (!validateEmail()) {
    //     return;
    // }

    // if (!validatePassword()) {
    //     return;
    // }

    if (isUserAlreadyRegistered()) {
      alert("User already registered. Please use a different email.");
      return;
    }

    const userData = { username, email, password };
    setUser([...user, userData]);

    // nav("/login");
    alert("Successfully signed in. Please login.");

    console.log("hlooo", user);
  }
  return (
    <div className="register">
      <h1 className="heading">SIGN UP</h1>
      <form onSubmit={handleRegister} className="reg-form">
        <div className="form-group">
          <label htmlFor="name"><b>Name:</b></label>
          <input
            id="name"
            className="input-field-block"
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email"><b>Email:</b></label>
          <input
            id="email"
            className="input-field-block"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password"><b>Password:</b></label>
          <input
            id="password"
            className="input-field-block"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmpassword"><b>Confirm Password:</b></label>
          <input
            id="confirmpassword"
            className="input-field-block"
            type="password"
            placeholder="Enter Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="submitbtn" type="submit">SIGN UP</button>
      </form>
    </div>
  );
}

export default Register;