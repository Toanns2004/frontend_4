import React, { useEffect, useState } from 'react';
import { FaHome, FaSearch } from 'react-icons/fa';
import './MenuHeader.css';

const MenuHeader = ({ searchTerm, setSearchTerm, goHome, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  // Hàm gọi API để lấy danh mục món ăn
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
        console.log('Categories fetched:', data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchCategories();
  }, []);

  // Hàm lọc danh mục dựa trên từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="navbar-menu d-flex flex-column sticky-header">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <button onClick={goHome} className="home-button">
          <FaHome className="home-icon" />
        </button>

        <div className="search-bar-container position-relative flex-grow-1 mx-3">
          <input
            type="text"
            placeholder="Tìm kiếm món ăn hoặc danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar form-control"
          />
          <FaSearch className="search-bar-icon position-absolute" />
        </div>
      </div>


      <div className="category-buttons-container d-flex">
        <button
          className={`category-button`}
          onClick={() => {
            setSelectedCategory(null);
            console.log('Selected category: All');
          }}
        >
          Tất cả
        </button>

        {/* Hiển thị danh mục đã lọc */}
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            className={`category-button`}
            onClick={() => {
              console.log('Category item:', category);
              setSelectedCategory(category.id);
              console.log('Selected category:', category.id);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>


      {/* Hiển thị từ khóa tìm kiếm bên dưới thanh cuộn */}
      <div className="search-result mb-2">
        {searchTerm && (
          <span>
            Kết quả tìm kiếm cho: <strong>{searchTerm}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default MenuHeader;
