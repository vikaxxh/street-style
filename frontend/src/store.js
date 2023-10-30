import {createStore, combineReducers,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import { newProductReducer, newReviewReducer, productDetailReducer, productReducer, productsReducer} from "./Reducer/ProductReducer"
import { userReducer, profileReducer, forgotPasswordReducer } from "./Reducer/userReducer"
import { cartReducer } from "./Reducer/cartReducer"
import { myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./Reducer/orderReducer"

const reducer = combineReducers({
    products:productsReducer,
    productDetails: productDetailReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product:productReducer,
})

let initialState={
    cart:{
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
        shippingInfo : localStorage.getItem("shippingInfo")
        ? JSON.parse(localStorage.getItem("shippingInfo"))
        : {}
    }
};
 const middleware = [thunk];

 const store = createStore(
     reducer,
      initialState,
      composeWithDevTools(applyMiddleware(...middleware)));

export default store