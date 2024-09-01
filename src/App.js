import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { Fragment, useEffect } from "react";
import { uiActions } from "./store/uiSlice";
import { cartActions } from "./store/cartSlice"; // Import cart actions to update the cart
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  // Fetch cart data when the app loads
  useEffect(() => {
    const fetchData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Fetching...",
          message: "Fetching cart data!",
        })
      );

      try {
        const response = await fetch(
          "https://reduxproject-211b3-default-rtdb.firebaseio.com/cart.json"
        );

        if (!response.ok) {
          throw new Error("Could not fetch data");
        }

        const data = await response.json();

        // Provide default values and update Redux state with fetched data
        const loadedCart = {
          items: data?.items || [],
          totalQuantity: data?.totalQuantity || 0,
        };

        dispatch(cartActions.replaceCart(loadedCart)); // Replace cart data in Redux store

        dispatch(
          uiActions.showNotification({
            status: "success",
            title: "Success!",
            message: "Fetched cart data successfully!",
          })
        );
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: error.message || "Fetching cart data failed!",
          })
        );
      }
    };

    fetchData();
  }, [dispatch]);

  // Send cart data when it changes
  useEffect(() => {
    const sendCartData = async () => {
      if (isInitial) {
        isInitial = false;
        return;
      }

      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data!",
        })
      );

      try {
        const response = await fetch(
          "https://reduxproject-211b3-default-rtdb.firebaseio.com/cart.json",
          {
            method: "PUT",
            body: JSON.stringify(cart),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Sending cart data failed!");
        }

        dispatch(
          uiActions.showNotification({
            status: "success",
            title: "Success!",
            message: "Sent cart data successfully!",
          })
        );
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: error.message || "Sending cart data failed!",
          })
        );
      }
    };

    sendCartData();
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
