import classes from "./MiniCart.module.css";
import CartItem from "./CartItem";
import { cartActions } from "../store/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MiniCart = (props) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const amount = useSelector((state) => state.cart.amount);
  const total = useSelector((state) => state.cart.total);
  const currency = useSelector((state) => state.currency.currency);
  const items = useSelector((state) => state.cart.items);

  const itemsArrayIsEmpty = items.length === 0;

  const openCartPageHandler = () => {
    navigate("/cart");
    props.onViewCart();
  };

  const Total = () => {
    if (currency === "EUR") {
      return (
        <>
          <FontAwesomeIcon icon="fa-euro-sign" />
          {(total * 1.025).toFixed(2)}
        </>
      );
    } else if (currency === "GBP") {
      return (
        <>
          <FontAwesomeIcon icon="fa-sterling-sign" />
          {(total * 0.8985).toFixed(2)}
        </>
      );
    }

    return (
      <>
        <FontAwesomeIcon icon="fa-dollar-sign" />
        {total.toFixed(2)}
      </>
    );
  };

  const checkoutHandler = () => {
    setShowModal(true);

    const timer = setTimeout(() => {
      setShowModal(false);
      dispatch(cartActions.clearArray());
      props.onCheckout();
      navigate("/home");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <>
      {!itemsArrayIsEmpty && (
        <div className={classes.cart}>
          <div className={classes.title}>
            <p>
              <b>My Cart</b>, {amount} items
            </p>
          </div>
          <ul className={classes.list}>
            {items.map((item) => {
              return (
                <CartItem
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  amount={item.amount}
                  imageUrl={item.imageUrl}
                  size={item.size}
                  color={item.color}
                />
              );
            })}
          </ul>
          <div className={classes.total}>
            <p>Total</p>
            <p>{<Total />}</p>
          </div>
          <div className={classes.buttons}>
            <button onClick={openCartPageHandler}>view cart</button>
            <button onClick={checkoutHandler}>check out</button>
          </div>
        </div>
      )}
      {itemsArrayIsEmpty && (
        <div className={classes.empty}>
          <p>Your cart is empty!</p>
        </div>
      )}
      {showModal && (
        <div className={classes.backdrop}>
          <div
            className={`${classes.modal} ${showModal ? classes.active : ""}`}
          >
            <p>Your order was sent successfully!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniCart;
