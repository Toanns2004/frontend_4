import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { getTableFromUrl } from '../../components/Service/TableService';
import FoodItem from "../../components/FoodItem/FoodItem.jsx";
import MenuHeader from './MenuHeader.jsx';
import FoodDetailModal from './FoodDetailModal.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CartBar.css';
import './Menu.css';

const Menu = () => {
  const { cartItems, food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoodList, setFilteredFoodList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null); // Trạng thái cho món ăn đã chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tableId, tableName } = getTableFromUrl(searchParams);

  useEffect(() => {
    // Lấy danh sách danh mục từ API
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Lọc các món ăn
    const results = food_list.filter(item => {
      const matchesSearchTerm = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === null || categories.some(category => 
        category.id === selectedCategory && category.dishes.some(dish => dish.id === item.id)
      );
      return matchesSearchTerm && matchesCategory;
    });
    setFilteredFoodList(results);
  }, [searchTerm, food_list, selectedCategory]);

  const openModal = (item) => {
    setSelectedFoodItem(item); // Cập nhật món ăn đã chọn
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedFoodItem(null); // Reset món ăn đã chọn
  };

  const goToCart = () => {
    const params = new URLSearchParams();
    params.set('table_id', tableId);
    params.set('table_name', tableName);
    navigate(`/cart?${params.toString()}`);
  };

  const totalItems = Object.values(cartItems).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <>
      <MenuHeader
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        goHome={() => navigate(`/?table_id=${tableId}&table_name=${tableName}`)}
      />

      <div className="container mt-4">
        <div className="row dishes-list">
          <div className="col-md-12">
            <h2>Dishes List</h2>
            {filteredFoodList.length === 0 ? (
              <p>Không có món ăn nào trong danh mục này.</p>
            ) : (
              <div className="row">
                {filteredFoodList.map(item => (
                  <div key={item.id} className="col-md-3 mb-4">
                    <FoodItem
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      discount={item.discount}
                      image={item.image}
                      status={item.status}
                      onClick={() => openModal(item)} // Gọi hàm mở modal
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {totalItems > 0 && (
          <div className="cart-bar" onClick={goToCart}>
            <div className="cart-bar-content">
              <div className="cart-icon">
                <span role="img" aria-label="cart">🛒</span>
              </div>
              <div className="cart-details">
                <span>Xem giỏ hàng ({totalItems})</span>
              </div>
              <div className="cart-arrow">
                <span>➤</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <FoodDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        foodItem={selectedFoodItem}
      />
    </>
  );
};

export default Menu;
