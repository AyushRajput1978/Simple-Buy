import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./custom-bootstrap.scss";
import "./custom-theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  PageNotFound,
  ForgotPassword,
  ResetPassword,
  Payment,
  MyProfile,
} from "./pages";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/Errorboundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardHome from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/ProtectedRoutes";
import DashboardLayout from "./components/DashboardLayout";
import "./main.css";
import ProductCategories from "./pages/Dashboard/ProductCategories";
import DashboardProducts from "./pages/Dashboard/Products";
import DashboardUsers from "./pages/Dashboard/Users";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DashboardOrders from "./pages/Dashboard/Orders";
import CustomToast from "./components/layout/CustomToast";
import UserOrders from "./pages/UserOrders";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <BrowserRouter>
              <Elements stripe={stripePromise}>
                <CustomToast />
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/product" element={<Products />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/profile" element={<MyProfile />} />
                    {/* Order related routes */}
                    <Route path="/user-orders" element={<UserOrders />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    {/* Authentication related routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/password-reset/:token?"
                      element={<ResetPassword />}
                    />
                    <Route path="/product/*" element={<PageNotFound />} />
                  </Route>
                  {/* dashboard Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute
                        allowedRoles={["admin", "superAdmin", "user"]}
                      >
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardHome />} />
                    <Route
                      path="product-categories"
                      element={<ProductCategories />}
                    />
                    <Route path="products" element={<DashboardProducts />} />
                    <Route path="orders" element={<DashboardOrders />} />
                    <Route path="users" element={<DashboardUsers />} />
                  </Route>

                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Elements>
            </BrowserRouter>
          </ErrorBoundary>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
