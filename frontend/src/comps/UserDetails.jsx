// import React, { useContext, useEffect } from "react"
// import { myContext } from "./Context";
// import axios from "axios";
// import "./UserDetails.css"

// export default function UserDetails(){
//     const {user, setUser,setBannedUser,bannedUser,} = useContext(myContext)

//     useEffect(() => {
//         fetchUser();
//       }, []);

//     const fetchUser=async()=>{
//         try {
//             const response = await axios.get(`http://localhost:4000/api/user/getuser`);
//             setUser(response.data.user);
//             console.log(response.data.user);
      
//             // const imageUrls = response.data.flatMap(product =>
//             //   product.imagePath ? product.imagePath.map(path => `${serverURL}/${path}`) : []
//             // );
//             // setImageURLs(imageUrls);
//           } catch (error) {
//             console.error('Error fetching users:', error);
//           }
//     }
//     console.log(user);


//     const BanUsers = (user) => {

//         // const currentBannedUsers = bannedUser || [];
        
//         if(bannedUser.includes(user)){
//             setBannedUser(bannedUser.filter(data => data !== user))
//             alert(`User has been Unbanned...`)
//         }
//         else{
//             setBannedUser([...bannedUser,user])
//             alert(`User has been Banned...`)
//         }
//     }
//     // console.log("user is banned",bannedUser)
    
//     return(
//         <div>
//             <h1 className="user">Users</h1>
//             <div>
//                 {user.map((user)=>(
//                  <div key={user.email}>
//                     <p className="user-t">Name: {user.name}</p>
//                     <p className="user-t">Email: {user.email}</p>
//                      <button className="banuser" onClick={() => BanUsers(user)} >
//                         {
//                         bannedUser?.includes(user)?"Unban User" : "Ban User"}
                
//                     </button>
//                     </div> 
//                 ))}
//             </div>
//         </div>
//     )
// }
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myContext } from "./Context";
import axios from "axios";
import "./UserDetails.css";

export default function UserDetails() {
  const { user, setUser, setBannedUser, bannedUser } = useContext(myContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/user/getuser`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const BanUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.put(`http://localhost:4000/api/user/banuser/${id}`);
        console.log(response.data);
        fetchUser(); 
    } catch (error) {
        console.error('Error banning user:', error);
        setError('Failed to ban user. Please try again later.');
    } finally {
        setLoading(false);
    }
};

const unbanUser = async (id) => {
    setLoading(true);
    setError(null);

    try {
        const response = await axios.put(`http://localhost:4000/api/user/unbanUser/${id}`);
        console.log(response.data);
        fetchUser(); 
    } catch (error) {
        console.error('Error unbanning user:', error);
        setError('Failed to unban user. Please try again later.');
    } finally {
        setLoading(false);
    }
};

const toggleBanStatus = (user) => {
  if (user.isBanned) {  // Use isBanned instead of banned
      unbanUser(user._id);
  } else {
      BanUser(user._id);
  }
};

const navigateToOrders = (userId) => {
  navigate(`/admin/orders/${userId}`);
};

  return (
    <div className="user-details-container">
      <h1 className="user-heading">User Details</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {user.map((user) => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
              <button
              className={`banuser ${user.isBanned ? "unban" : "ban"}`}
              onClick={() => toggleBanStatus(user)}
              disabled={loading}
              >
              {user.isBanned ? "Unban User" : "Ban User"}
              </button>
              <button className="view-orders"
              onClick={() => navigateToOrders(user._id)}
              >
                View Orders
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

