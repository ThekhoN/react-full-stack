import React from "react";
import "materialize-css/dist/css/materialize.min.css";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import App from "./components/App";
import reducers from "./reducers";
import axios from "axios";
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// console.log('STRIP_KEY: ', process.env.REACT_APP_STRIPE_KEY);
// console.log('Environment: ', process.env.NODE_ENV);
