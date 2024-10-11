import CustomNavbar from "./Navbar";
import DishesItem from "./DishesItem.jsx";

const Notification = () => {
    return(
        <>
            <CustomNavbar/>
            <div className="container">
                <DishesItem/>
            </div>
        </>
    )
}

export default Notification;