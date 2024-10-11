import {Button, Form, Modal} from "react-bootstrap";
import paymentImage from "../../../assets/request_payment.svg";

import React, {useState} from "react";
import '../CustomModel.css';
import '../Home.css';

const PaymentRequest = ()=> {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState('');

    const handlePaymentChange = (event) => {
        setSelectedPayment(event.target.value);
    };


    const handleClosePaymentModal = () => {
        setShowPaymentModal(false)};


    const handleSubmitPayment = () => {
        if (selectedPayment) {
            localStorage.setItem('paymentMethod', selectedPayment);

            setShowPaymentModal(false);
        } else {
            alert('Vui lòng chọn một phương thức thanh toán trước khi gửi.');
        }
    };
    const handleShowPaymentModal = () => setShowPaymentModal(true);



    return(
    <>
                <div className="action-item">
                    <button className="action-button" onClick={handleShowPaymentModal}>
                        <img src={paymentImage} alt="Payment Icon" className="action-icon" />
                        <span className="action-text">Request Bill</span>
                    </button>
                </div>

                <Modal show={showPaymentModal} onHide={handleClosePaymentModal} dialogClassName="custom-payment-modal">
                    <Modal.Header >
                        <Modal.Title>Gọi thanh toán</Modal.Title>
                        <div className="title">
                            <p>Bạn muốn thanh toán bằng ?</p>
                        </div>
                    </Modal.Header>
                    <Modal.Body>

                        <Form>
                            <div
                                className={`payment-option ${selectedPayment === 'Cash' ? 'selected' : ''}`}
                                onClick={() => setSelectedPayment('Cash')}
                            >
                                <Form.Check
                                    type="radio"
                                    label="Tiền mặt"
                                    name="payment"
                                    value="Cash"
                                    checked={selectedPayment === 'Cash'}
                                    onChange={handlePaymentChange}
                                />
                            </div>

                            <div
                                className={`payment-option ${selectedPayment === 'CreditCard' ? 'selected' : ''}`}
                                onClick={() => setSelectedPayment('CreditCard')}
                            >
                                <Form.Check
                                    type="radio"
                                    label="Thẻ ngân hàng"
                                    name="payment"
                                    value="CreditCard"
                                    checked={selectedPayment === 'CreditCard'}
                                    onChange={handlePaymentChange}
                                />
                            </div>

                            <div
                                className={`payment-option ${selectedPayment === 'MobilePayment' ? 'selected' : ''}`}
                                onClick={() => setSelectedPayment('MobilePayment')}
                            >
                                <Form.Check
                                    type="radio"
                                    label="Ứng dụng điện thoại"
                                    name="payment"
                                    value="MobilePayment"
                                    checked={selectedPayment === 'MobilePayment'}
                                    onChange={handlePaymentChange}
                                />
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="submit-button" onClick={handleSubmitPayment}>
                            Gửi yêu cầu
                        </Button>
                    </Modal.Footer>
                </Modal>
    
    </>
    )
}

export default PaymentRequest