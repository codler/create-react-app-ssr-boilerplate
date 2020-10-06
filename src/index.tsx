import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { FetchersResources, FetcherResourcesCTX } from "./hooks/useFetch";
import { BrowserRouter as Router } from "react-router-dom";

const fetchersResources: FetchersResources = (window as any)
  .__FETCHERS_RESOURCES__ || { fethchersResources: {} };

const callMethod = process.env.NODE_ENV === "production" ? "hydrate" : "render";

ReactDOM[callMethod](
  <FetcherResourcesCTX.Provider value={fetchersResources}>
    <Router>
      <App />
    </Router>
  </FetcherResourcesCTX.Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
