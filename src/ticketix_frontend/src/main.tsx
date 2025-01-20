import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { InternetIdentityProvider } from "ic-use-internet-identity";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { persistor, store } from "./store";
// import { AuthProvider } from "./store/AuthProvider";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <InternetIdentityProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              {/* <AuthProvider> */}
              <App />
              {/* </AuthProvider> */}
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </InternetIdentityProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
