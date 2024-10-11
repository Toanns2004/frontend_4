import {Button, Form, Modal} from "react-bootstrap";
import rateImage from "../../assets/rate.svg";
import React, {useState} from "react";
import './CustomModel.css';
import './Home.css';
import ServiceRequest from "./btn/ServiceRequest";
import PaymentRequest from "./btn/PaymentRequest";
import FeedbackRequest from "./btn/FeedbackRequest";
const ButtonHome=()=>{


    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedbackReasons, setFeedbackReasons] = useState([]);
    const [phone, setPhone] = useState('');
    const [comment, setComment] = useState('');


    


    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleRating = (rate) => {
        setRating(rate);
    };

    const handleFeedbackReason = (reason) => {
        setFeedbackReasons(prev =>
            prev.includes(reason)
                ? prev.filter(r => r !== reason)
                : [...prev, reason]
        );
    };

    const handleSubmit = () => {
        console.log({
            rating,
            feedbackReasons,
            phone,
            comment,
        });
        handleClose();
    };

    

    

    return(
        <>
            <div className="actions">
                <PaymentRequest/>

                <ServiceRequest/>

                <FeedbackRequest/>
            </div>

        </>
    )
}
export default ButtonHome;