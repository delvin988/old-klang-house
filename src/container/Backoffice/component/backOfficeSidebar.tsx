import {
  FiHome,
  FiCalendar,
  FiCoffee,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import "../component/BackOfficeSidebar.css";
import { NavLink } from "react-router-dom";

type Props = {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const BackofficeSidebar = ({ onLogout, isOpen, onClose }: Props) => {
  return (
    <>
      <div
        className={`sidebarOverlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__logo">
          <h2>Old Klang House</h2>
          <span>Backoffice</span>
        </div>

        <nav className="sidebar__menu">
          <NavLink
            to="/backoffice/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__item active" : "sidebar__item"
            }
          >
            <FiHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/backoffice/reservation"
            className={({ isActive }) =>
              isActive ? "sidebar__item active" : "sidebar__item"
            }
          >
            <FiCalendar />
            Reservations
          </NavLink>

          <NavLink
            to="/backoffice/menus"
            className={({ isActive }) =>
              isActive ? "sidebar__item active" : "sidebar__item"
            }
          >
            <FiCoffee />
            Menu Management
          </NavLink>

          <NavLink
            to="/backoffice/customers"
            className={({ isActive }) =>
              isActive ? "sidebar__item active" : "sidebar__item"
            }
          >
            <FiUsers />
            Customers
          </NavLink>
        </nav>

        <button className="sidebar__logout" onClick={onLogout}>
          <FiLogOut />
          Logout
        </button>
      </aside>
    </>
  );
};

export default BackofficeSidebar;
