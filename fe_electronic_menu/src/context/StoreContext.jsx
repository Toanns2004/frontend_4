import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const url = "http://localhost:8080";
    const [food_list, setFoodList] = useState([]);
    const [orderDishes, setOrderDishes] = useState([]);
    const [dishes, setListDishes] = useState([]);

    // Hàm lấy danh sách món ăn theo orderId
    const fetchDishesByOrderId = async (orderId) => {
        try {
            const response = await axios.get(`${url}/api/v1/order_item/${orderId}`);
            setListDishes(response.data);
            console.log("Fetched dishes list: ", response.data);
        } catch (error) {
            console.error("Error fetching dishes list:", error);
        }
    };

    useEffect(() => {
        const id = localStorage.getItem("IdOrder");
        if (id) {
            fetchDishesByOrderId(id);
        } else {
            console.warn("No order ID found in localStorage.");
        }
    }, []); // Chạy một lần khi component được mount

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = (id) => {
        setCartItems(prevItems => {
            const updatedItems = { ...prevItems, [id]: (prevItems[id] || 0) + 1 };
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            console.log("Updated Cart Items: ", updatedItems); // Xem nội dung giỏ hàng
            return updatedItems;
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (id) => {
        setCartItems(prevItems => {
            const updatedItems = { ...prevItems };

            // Xóa toàn bộ sản phẩm ra khỏi giỏ hàng
            delete updatedItems[id];

            // Cập nhật localStorage
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return updatedItems;
        });
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    const updateQuantity = (id, quantity) => {
        setCartItems(prevItems => {
            const updatedItems = { ...prevItems };
            const newQuantity = Math.max(0, quantity);
            if (newQuantity > 0) {
                updatedItems[id] = newQuantity;
            } else {
                delete updatedItems[id];
            }
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    // Hàm tính tổng số tiền trong giỏ hàng
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) { // Kiểm tra itemInfo có tồn tại
                    totalAmount += itemInfo.price * cartItems[item];
                } else {
                    console.log(`Product with id ${item} not found in food_list`);
                }
            }
        }
        return totalAmount;
    };

    // Hàm lấy danh sách món ăn
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/v1/dishes`);
            setFoodList(response.data.content);
            console.log("Fetched food list: ", response.data.content); // Xem danh sách món ăn
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const removeFromItem = (id) => {
        setCartItems(prevItems => {
            const updatedItems = { ...prevItems };

            if (updatedItems[id] > 1) {
                // Nếu số lượng sản phẩm lớn hơn 1, giảm số lượng
                updatedItems[id] -= 1;
            } else {
                // Nếu số lượng sản phẩm bằng 1, xóa sản phẩm khỏi giỏ hàng
                delete updatedItems[id];
            }

            // Cập nhật giỏ hàng trong localStorage
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList(); // Lấy danh sách món ăn
        };
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        removeFromItem,
        updateQuantity,
        getTotalCartAmount,
        url,
        setFoodList,
        fetchFoodList,
        fetchDishesByOrderId,
        orderDishes,
        dishes// Thêm danh sách món ăn theo order
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
