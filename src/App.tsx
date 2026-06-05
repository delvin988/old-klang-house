import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AboutUs, FindUs, Footer, Header, SpecialMenu } from "./container";

import RestaurantBackofficeDashboard from "./container/Backoffice/RestaurantBackofficeDashboard";
import BackofficeLogin from "./container/Backoffice/BackOfficeLogin";
import ReservationManagement from "./container/Backoffice/reservation/reservationManagement";
import MenuManagement from "./container/Backoffice/menuManagement/MenuManagement";
import CustomerManagement from "./container/Backoffice/customerManagement/CustomerManagement";

import "./App.css";

type HomeProps = {
  language: "en" | "id";
  setLanguage: React.Dispatch<React.SetStateAction<"en" | "id">>;
};

const Home: React.FC<HomeProps> = ({ language, setLanguage }) => (
  <div
    style={{
      overflowX: "hidden",
      maxWidth: "100%",
    }}
  >
    <Header language={language} setLanguage={setLanguage} />

    <AboutUs language={language} />

    <SpecialMenu language={language}/>

    <FindUs language={language} />

    <Footer language={language}/>
  </div>
);

const ProtectedBackoffice = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/backoffice" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [language, setLanguage] = React.useState<"en" | "id">("en");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home language={language} setLanguage={setLanguage} />}
        />

        <Route path="/backoffice" element={<BackofficeLogin />} />

        <Route
          path="/backoffice/dashboard"
          element={
            <ProtectedBackoffice>
              <RestaurantBackofficeDashboard />
            </ProtectedBackoffice>
          }
        />

        <Route
          path="/backoffice/reservation"
          element={
            <ProtectedBackoffice>
              <ReservationManagement />
            </ProtectedBackoffice>
          }
        />
        <Route
          path="/backoffice/menus"
          element={
            <ProtectedBackoffice>
              <MenuManagement />
            </ProtectedBackoffice>
          }
        />
        <Route
          path="/backoffice/customers"
          element={
            <ProtectedBackoffice>
              <CustomerManagement />
            </ProtectedBackoffice>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
