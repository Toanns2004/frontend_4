import React, { useEffect, useState, useContext } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; 
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext.jsx';
import './Navbar.css';
import { getTableFromUrl, setTableToUrl } from '../../components/Service/TableService';


const CustomNavbar = () => {
    const { url } = useContext(StoreContext); // Lấy URL từ StoreContext
    const [orderStatus, setOrderStatus] = useState('');
    const [status, setStatus] = useState('');

    const [searchParams] = useSearchParams();
    const { tableId, tableName } = getTableFromUrl(searchParams);

    const navigate = useNavigate();



    // Hàm lấy trạng thái đơn hàng theo orderId
    const fetchOrderStatusById = async (orderId) => {
        try {
            const response = await axios.get(`${url}/api/v1/orders/${orderId}`);
            setOrderStatus(response.data.status); // Lưu trạng thái đơn hàng
        } catch (error) {
            console.error('Error fetching order status:', error);
        }
    };

    useEffect(() => {
        const orderId = localStorage.getItem('IdOrder'); // Lấy orderId từ localStorage
        if (orderId) {
            fetchOrderStatusById(orderId); // Gọi hàm lấy trạng thái đơn hàng
        } else {
            console.warn('No order ID found in localStorage.');
        }
    }, []);

    // Hàm kiểm tra trạng thái đơn hàng
    const checkStatus = () => {
        if (orderStatus === "Paid") {
            setStatus("Đã thanh toán");
        } else if (orderStatus === "Pending") {
            setStatus("Đang chờ");
        } else {
            setStatus("Trạng thái không xác định");
        }
    };

    // Gọi checkStatus mỗi khi orderStatus thay đổi
    useEffect(() => {
        if (orderStatus) {
            checkStatus();
        }
    }, [orderStatus]);


    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand className="d-flex flex-column align-items-start">
                    <div className="d-flex align-items-center">
                        <Link to={`/?table_id=${tableId}&table_name=${tableName}`} className="icon-link-notification">
                            <i className="bi bi-house-door"></i>
                        </Link>
                        <span className="ms-2">
    Các món đã gọi (
    <span
        style={{ color: status === "Đã thanh toán" ? "green" : status === "Đang chờ" ? "orange" : "red" }}
    >
        {status}
    </span>
    )
</span>

                    </div>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
