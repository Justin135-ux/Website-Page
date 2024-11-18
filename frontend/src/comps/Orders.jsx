import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Orders.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { userId: paramUserId } = useParams(); // get from route params
    const [userId, setUserId] = useState(paramUserId || null); // state to store userId

    useEffect(() => {
        // If userId is not passed in URL, fetch it from session or local storage (for regular users)
        if (!paramUserId) {
            const loggedInUserId = localStorage.getItem("userId"); // or wherever you're storing logged-in user's ID
            if (loggedInUserId) {
                setUserId(loggedInUserId);
            } else {
                console.error("No userId found for this session");
                return;
            }
        }

        async function fetchAllOrders() {
            try {
                const response = await axios.get(`http://localhost:4000/api/user/getUserOrders/${userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                if (error.response && error.response.status === 404) {
                    alert("No orders found for this user");
                } else {
                    alert("An error occurred while fetching orders");
                }
            }
        }

        if (userId) {
            fetchAllOrders();
        }
    }, [userId, paramUserId]);

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/user/deleteOrder/${orderId}`);
            alert(response.data.message);
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
        }
    };

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id} className="order">
                        <h3>Order Date: {new Date(order.order_date).toLocaleDateString()}</h3>
                        <p>Total Amount: ₹{order.totalAmount}</p>
                        <div className="order-items">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map(item => (
                                    <div key={item.product_id} className="order-item">
                                        <img src={item.image} alt={item.name} />
                                        <p>{item.name}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ₹{item.price}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No items in this order</p>
                            )}
                        </div>
                        <button className="delete-button" onClick={() => handleDeleteOrder(order._id)}>
                            Delete Order
                        </button>
                    </div>
                ))
            ) : (
                <h2>No orders found</h2>
            )}
        </div>
    );
};

export default Orders;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import "./Orders.css";

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const {userId}=useParams();

//     console.log("userid",userId);

//     useEffect(() => {
//         if (!userId) {
//             console.error("No userId found in URL");
//             return;
//         }
//         async function fetchAllOrders() {
//             try {
//                 const response = await axios.get(`http://localhost:4000/api/user/getUserOrders/${userId}`);
//                 setOrders(response.data);
//             } catch (error) {
//                 console.error("Error fetching orders:", error);
//                 if (error.response && error.response.status === 404) {
//                     alert("No orders found for this user");
//                 } else {
//                     alert("An error occurred while fetching orders");
//                 }
//             }
//         }
//         fetchAllOrders();
//     }, [userId]);

//     const handleDeleteOrder = async (orderId) => {
//         try {
//             const response = await axios.delete(`http://localhost:4000/api/user/deleteOrder/${orderId}`);
//             alert(response.data.message);
    
//             setOrders(orders.filter(order => order._id !== orderId));
//         } catch (error) {
//             console.error("Error deleting order:", error);
//             alert("Failed to delete order");
//         }
//     };
    
//     return (
//         <div className="orders-page">
//             <h1>Your Orders</h1>
//             {orders.length > 0 ? (
//                 orders.map(order => (
//                     <div key={order._id} className="order"> 
//                         <h3>Order Date: {new Date(order.order_date).toLocaleDateString()}</h3>
//                         <p>Total Amount: ₹{order.totalAmount}</p>
//                         <div className="order-items">
//                             {order.orderItems && order.orderItems.length > 0 ? (
//                                 order.orderItems.map(item => (
//                                     <div key={item.product_id} className="order-item">
//                                         <img src={item.image} alt={item.name} />
//                                         <p>{item.name}</p>
//                                         <p>Quantity: {item.quantity}</p>
//                                         <p>Price: ₹{item.price}</p>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p>No items in this order</p>
//                             )}
//                         </div>
//                         <button
//                             className="delete-button"
//                             onClick={() => handleDeleteOrder(order._id)}
//                         >
//                             Delete Order
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <h2>No orders found</h2>
//             )}
//         </div>
//     );
// };

// export default Orders;