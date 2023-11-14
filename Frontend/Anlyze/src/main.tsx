import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Register from "./pages/Register.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { AuthProvider } from "./components/auth-provider.tsx";
import { CookiesProvider } from "react-cookie";
import Layout from "./pages/Layout.tsx";
import Logout from "./pages/Logout.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CookiesProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/home" element={<Home />} />
              </Route>
            </Routes>
          </CookiesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
    <Toaster />
  </React.StrictMode>
);
