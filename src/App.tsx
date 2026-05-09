import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AboutUs, Chef, FindUs, Footer, Gallery, Header, Intro, Laurels, SpecialMenu } from './container';
import WhatsAppButton from "./container/Footer/WhatsAppButton";

import RestaurantBackofficeDashboard
  from "./container/Backoffice/RestaurantBackofficeDashboard";

import "./App.css";

const Home = () => (
  <div
    style={{
      overflowX: "hidden",
      maxWidth: "100%",
    }}
  >
    <Header />
    <AboutUs />
    <SpecialMenu />
    <FindUs />
    <Footer />
    {/* <WhatsAppButton/> */}
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/backoffice"
        element={
          <RestaurantBackofficeDashboard />
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;