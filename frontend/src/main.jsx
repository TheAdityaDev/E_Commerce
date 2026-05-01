import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./Redux Toolkit/store.js";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { StrictMode } from "react";

// ✅ Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => {

        // Auto update logic
        registration.onupdatefound = () => {
          const newWorker = registration.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          };
        };
      })
  });
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer
        limit={3}
        autoClose={3000} // closes after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <App />
    </Provider>
  </BrowserRouter>,
);
