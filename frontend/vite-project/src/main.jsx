import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./index.css";
import { UiProvider } from "./api/UiContext.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import GlobalError from "./components/GlobalError.jsx";

import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UiProvider>
      <AuthProvider>
        <BrowserRouter>
        <ToastContainer />
          <GlobalLoader />
          <GlobalError />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </UiProvider>
  </React.StrictMode>,
);
