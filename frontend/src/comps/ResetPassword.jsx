import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './ResetPassword.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Send password reset request to the server
      console.log(id, token);
      const response = await axios.post(`http://localhost:4000/api/user/userResetPassword/66f662fd3df3bdc8d93cbb35/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjY2MmZkM2RmM2JkYzhkOTNjYmIzNSIsImlhdCI6MTcyOTc2MjAyOCwiZXhwIjoxNzI5ODQ4NDI4fQ.Ku_wG29EI2kFWO8eKeH5ef23yWWqVfnCcS7djLBSwZk
`, {
        password: newPassword
      });
      

      if (response.data.Status === "Success") {
        setMessage("Password reset successfully.");
        setError("");
        
        // Display success message and navigate to login page after a delay
        setTimeout(() => {
          alert("Password reset is successful");
          navigate("/login");
        }, 1000); // 1-second delay before navigation
      } else {
        setError(response.data.message || "An error occurred.");
      }
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.message === "The reset link has expired. Please request a new one.") {
        setError("The reset link has expired. Please request a new one.");
      } else {
        setError(error.response?.data?.error || "An error occurred while resetting the password.");
      }
      setMessage("");
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <button className="login-button" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
}

export default ResetPassword;
