import React, {useContext} from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import {StoreContext} from "../../context/StoreContext.jsx";

const Navbar = () => {
    const { cartItems, setCartItems, food_list, updateQuantity, removeFromCart, url } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước
    };

    const handleClearCart = () => {
        localStorage.removeItem('cartItems');
        setCartItems({});
        console.log("Giỏ hàng đã bị xóa");
    };

    return (
        <div className="navbar-container d-flex justify-content-between align-items-center p-3 bg-light">
            <div className="back-button">
                <button className="btn btn-outline-secondary" onClick={handleBack}>
                    <i className="bi bi-chevron-left"></i>
                </button>
            </div>
            <div className="navbar-title text-center flex-fill">
                <h5>Các món đang chọn</h5>
            </div>
            <div className="clear-cart-button">
                <button className="btn btn-outline-danger" onClick={handleClearCart}>
                    Xóa giỏ
                </button>
            </div>
        </div>
    );
}

export default Navbar;
