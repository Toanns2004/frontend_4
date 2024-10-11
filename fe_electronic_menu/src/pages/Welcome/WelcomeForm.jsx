import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './WelcomeForm.css';

const WelcomeForm = ({onSubmitName}) => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('VIETNAM'); // Trạng thái cho ngôn ngữ
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = (e) => {
      e.preventDefault();
      if (name.trim()) {
          localStorage.setItem('paymentMethod',"Cash")
          onSubmitName(name); // Gọi hàm onSubmitName để lưu tên và chuyển hướng
      } else {
          alert("Vui lòng nhập tên!"); // Nếu chưa nhập tên, thông báo lỗi
      }
  };
  return (
    <div className="welcome-container">
      <img src="https://o2o.ipos.vn/static/images/icon_staff.svg" alt="Staff Icon" />
      <h1>Trà Đá Quán! Xin Kính chào bạn</h1>
      <p>Mời bạn nhập tên để nhà hàng phục vụ bạn nhanh chóng hơn, chính xác hơn</p>
      <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên của bạn"
                    className="name-input"
                />
                <button type="submit" className="start-btn">Bắt đầu</button>
            </form>
      <div className="language-selector">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-dropdown">
          <option value="VIETNAM">VIETNAM</option>
          <option value="ENGLISH">ENGLISH</option>
          <option value="FRANCAIS">FRANCAIS</option>
        </select>
      </div>
    </div>
  );
};

export default WelcomeForm;
