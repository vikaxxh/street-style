import Header from "./component/layout/Header/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import "./App.css";
import LoginSignUp from "./component/User/LoginSignUp";
import React, { useEffect, useState } from "react";
import WebFont from "webfontloader";
import store from "./store";
import { loadUser } from "./action/userAction";
import UserOption from "./component/layout/Header/UserOption.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Process from "./component/Cart/Process.js";
import OrderSucess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from './component/admin/ProductList.js'
import NewProduct from "./component/admin/NewProduct"
import UpdateProduct from "./component/admin/UpdateProduct.js";


function App() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  return (
    <Router>
      <ToastContainer position="bottom-center" limit={2} />
      {isAuthenticated && <UserOption user={user} />}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {isAuthenticated && <Route path="/account" element={<Profile />} />}
        {isAuthenticated && (
          <Route path="/me/update" element={<UpdateProfile />} />
        )}
        {isAuthenticated && (
          <Route path="/process/payment" element={<Process />} />
        )}
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        {isAuthenticated && (
          <Route path="/password/update" element={<UpdatePassword />} />
        )}
        {isAuthenticated && <Route path="/success" element={<OrderSucess />} />}
        {isAuthenticated && <Route path="/orders" element={<MyOrders />} />}

        {isAuthenticated && <Route path="/shipping" element={<Shipping />} />}
        {isAuthenticated && (
          <Route path="/order/confirm" element={<ConfirmOrder />} />
        )}
        {isAuthenticated && (
          <Route path="/order/:id" element={<OrderDetails />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route path="/admin/dashboard" element={<Dashboard />} />
        )}

        {isAuthenticated && user.role === "admin" && (
          <Route path="/admin/products" element={<ProductList />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route path="/admin/product" element={<NewProduct />} />
        )}
        {isAuthenticated && user.role === "admin" && (
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
