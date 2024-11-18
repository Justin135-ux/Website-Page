import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h2>About Us</h2>
                    <p>We are a company dedicated to providing the best services to our customers. Our mission is to deliver high-quality products and exceptional customer service.</p>
                </div>
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h2>Contact Us</h2>
                    <ul>
                        <li>Email: @merusdigitalshop.com</li>
                        <li>Phone: +992 674 5320</li>
                        <li>Address: 680513 Florida, Miami, U.S.A</li>
                    </ul>
                </div>
                <div className="footer-section social">
                    <h2>Follow Us</h2>
                    <div className="social-links">
                        <a href="#"><img src="https://i.pinimg.com/474x/4d/ea/be/4deabe20c76be45acb037176a3c1061d.jpg" alt="Facebook" /></a>
                        <a href="#"><img src="https://i.pinimg.com/236x/1c/66/e2/1c66e2c88484c5765b8967761df8503e.jpg" alt="Twitter" /></a>
                        <a href="#"><img src="https://i.pinimg.com/236x/54/95/cc/5495ccb9d7ad74bb2023fb97222c6562.jpg" alt="Instagram" /></a>
                        {/* <a href="#"><img src="linkedin-icon.png" alt="LinkedIn" /></a> */}
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 MERUS DIGITAL SHOP. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

