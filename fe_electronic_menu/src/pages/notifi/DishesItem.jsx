import React, { useEffect, useContext } from "react";
import { Card } from "react-bootstrap";
import { StoreContext } from "../../context/StoreContext.jsx";

const DishesItem = () => {
    const { url, dishes, fetchDishesByOrderId } = useContext(StoreContext); // Lấy hàm từ context

    useEffect(() => {
        const orderId = localStorage.getItem("IdOrder");
        if (orderId) {
            console.log(dishes);
            
            fetchDishesByOrderId(orderId); // Gọi hàm từ StoreContext
        } else {
            console.warn("No order ID found in localStorage.");
        }
    }, []);

    return (
        <>
            {dishes.length > 0 ? (
                dishes.map((item) => (
                    <Card key={item.id} className="d-flex flex-row align-items-center p-2 shadow-sm mb-3">
                        <div className="item-image">
                            <img
                                src={`${url}/images/${item.dish?.image}`}
                                alt={item.dish?.name}
                                className="rounded"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="item-info ms-3 flex-grow-1">
                            <div className="item-title">
                                <span className="item-quantity text-danger">{item.quantity} ×</span> {item.dish?.name}
                            </div>
                            <div className="item-price text-muted">{item.price.toLocaleString()} đ</div>
                        </div>
                    </Card>
                ))
            ) : (
                <div>No dishes found</div>
            )}
        </>
    );
};

export default DishesItem;
