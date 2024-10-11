// FoodDetailModal.jsx
import React from 'react';
import './FoodDetailModal.css'; // Bạn có thể tạo file CSS cho modal

const FoodDetailModal = ({ isOpen, onClose, foodItem }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{foodItem.name}</h2>
        <img src={foodItem.image} alt={foodItem.name} className="food-image" />
        <p>Giá: {foodItem.price} VND</p>
        <p>Giảm giá: {foodItem.discount}%</p>
        <p>Mô tả: {foodItem.description}</p> {/* Nếu có trường mô tả trong item */}
        {/* Thêm các thông tin khác nếu cần */}
      </div>
    </div>
  );
};

export default FoodDetailModal;
