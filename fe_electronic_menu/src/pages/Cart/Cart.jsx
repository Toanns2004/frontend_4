import React, { useContext } from "react";
import './Cart.css';
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; 
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Swal from "sweetalert2";
import { getTableFromUrl, setTableToUrl } from '../../components/Service/TableService'; 
const Cart = () => {
    const { cartItems, setCartItems, food_list, updateQuantity, removeFromCart, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    const { tableId, tableName } = getTableFromUrl(searchParams);


    const totalOriginalPrice = food_list.reduce((total, item) => {
        const quantity = cartItems[item.id] || 0;
        return total + (item.price * quantity);
    }, 0);

    const totalAmount = food_list.reduce((total, item) => {
        const quantity = cartItems[item.id] || 0;
        const discount = item.discount ? parseFloat(item.discount) : 0;
        const discountedPrice = item.price * (1 - (discount / 100));
        return total + (discountedPrice * quantity);
    }, 0);


    const handleSendOrderRequest = async () => {
        try {
            console.log(localStorage.getItem('paymentMethod'));
            // Xây dựng orderRequest từ dữ liệu giỏ hàng
            const orderRequest = {
                customer: localStorage.getItem('username'),
                originalPrice: totalOriginalPrice,
                coupon:"10%",
                orderItems: Object.keys(cartItems).map(itemId => ({
                    dish_id: itemId,
                    quantity: cartItems[itemId],
                    
                })),
                createAt: new Date().toISOString(),
                status: "Pending",
                payment: localStorage.getItem('paymentMethod')
            };
            console.log(tableId)

            // Kiểm tra nếu giỏ hàng có món
            if (Object.keys(cartItems).length > 0) {
                const response = await axios.post(`http://localhost:8080/api/v1/orders/${tableId}`, orderRequest);
                if (response.status === 200) {
                    console.log("Order created successfully!", response.data);
                    localStorage.setItem('IdOrder', response.data.id);

                    // Hiển thị thông báo SweetAlert2 ở giữa màn hình
                    Swal.fire({
                        position: "center",  // Hiển thị thông báo ở giữa màn hình
                        icon: "success",
                        title: "Đã gửi yêu cầu đến đầu bếp!",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    localStorage.removeItem('cartItems');
                    setCartItems({});  // Reset giỏ hàng
                    navigate(`/?table_id=${tableId}&table_name=${tableName}`);
                } else {
                    console.error("Error creating order: ", response);
                    alert("Có lỗi xảy ra khi tạo đơn hàng.");
                }
            } else {
                alert("Vui lòng chọn món!");
            }
        } catch (error) {
            console.error("Error while sending order request: ", error);
            alert("Có lỗi xảy ra khi gửi yêu cầu tạo đơn hàng.");
        }
    };


    return (
        <section>
            <Navbar />

            {Object.keys(cartItems).length > 0 ? (
                <div className='cart'>
                    <div className="cart-container border rounded p-3 bg-light">
                        <div className="cart-items">
                            <div className="row text-center fw-bold text-muted">
                                <div className="col">Items</div>
                                <div className="col">Title</div>
                                <div className="col">Price</div>
                                <div className="col">Discount</div>
                                <div className="col">Quantity</div>
                                <div className="col">Total</div>
                                <div className="col">Remove</div>
                            </div>
                            <hr />
                            {food_list.map((item) => {
                                const quantity = cartItems[item.id] || 0;
                                if (quantity > 0) {
                                    const discount = item.discount ? parseFloat(item.discount) : 0;
                                    const discountedPrice = item.price * (1 - (discount / 100));
                                    return (
                                        <div key={item._id} className='row align-items-center'>
                                            <div className='col text-center'>
                                                <img src={`${url}/images/${item.image}`} alt={item.name} className="img-fluid" style={{ width: "50px" }} />
                                            </div>
                                            <div className='col text-center'>{item.name}</div>
                                            <div className='col text-center'>${item.price.toFixed(2)}</div>
                                            <div className='col text-center'>{discount > 0 ? `${discount}%` : 'No discount'}</div>
                                            <div className='col text-center quantity-container'>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value, 10))}
                                                    className="form-control quantity-input"
                                                />
                                            </div>
                                            <div className='col text-center'>${(discountedPrice * quantity).toFixed(2)}</div>
                                            <div className='col text-center'>
                                                <p onClick={() => removeFromCart(item.id)} className='cross text-danger' style={{ cursor: "pointer" }}>x</p>
                                            </div>
                                            <hr />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                    <div className="cart-bottom d-flex justify-content-between mt-4">
                        <div className="cart-total flex-fill me-2">
                            <h2>Cart Totals</h2>
                            <div>
                                <div className="d-flex justify-content-between">
                                    <p>Subtotal (Original Price)</p>
                                    <p>${totalOriginalPrice.toFixed(2)}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p>Subtotal (Discounted Price)</p>
                                    <p>${totalAmount.toFixed(2)}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total</span>
                                    <span>${totalAmount === 0 ? 0 : totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <button className="btn btn-danger mt-2" onClick={handleSendOrderRequest}>
                                SEND ORDER REQUEST
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="empty-cart-container">
                    <div className="image-cart-empty">
                        <img src="/src/assets/cart_empty.jpg" alt="Empty Cart" />
                    </div>
                    <div className="empty-cart-message">
                        <p>Vui lòng chọn đồ ăn !</p>
                    </div>
                    <Link to={`/menu?table_id=${tableId}&table_name=${tableName}`} className="btn empty-cart-btn">
                        Đi đến Menu
                    </Link>
                </div>
            )}
        </section>
    );
}

export default Cart;
