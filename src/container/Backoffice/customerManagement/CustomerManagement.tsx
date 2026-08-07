import React from "react";

import { useNavigate } from "react-router-dom";

import BackofficeSidebar from "../component/backOfficeSidebar";

import "./CustomerManagement.css";
import "../RestaurantBackofficeDashboard.css";

type Customer = {
  customerName: string;
  phone: string;
  email: string;
  totalReservations: number;
  lastReservation: string;
};

const CustomerManagement = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [customers, setCustomers] = React.useState<Customer[]>([]);

  const [search, setSearch] = React.useState("");
  const [sortField, setSortField] = React.useState("customerName");

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );

  const [currentPage, setCurrentPage] = React.useState(1);

  const rowsPerPage = 10;
  const [historyPage, setHistoryPage] = React.useState(1);

  const historyRows = 10;

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/backoffice");
  };

  const loadCustomers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://okhrestaurant-ca7148d529c4.herokuapp.com/api/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setCustomers(data);
  };

  React.useEffect(() => {
    loadCustomers();
  }, []);
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search),
    )
    .sort((a: any, b: any) => {
      let aValue = a[sortField as keyof typeof a];

      let bValue = b[sortField as keyof typeof b];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }

      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage),
  );

  const lastIndex = currentPage * rowsPerPage;

  const firstIndex = lastIndex - rowsPerPage;

  const currentCustomers = filteredCustomers.slice(firstIndex, lastIndex);
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(null);

  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const reservationHistory = selectedCustomer?.reservations || [];

  const historyLastIndex = historyPage * historyRows;

  const historyFirstIndex = historyLastIndex - historyRows;

  const currentHistory = reservationHistory.slice(
    historyFirstIndex,
    historyLastIndex,
  );

  const historyTotalPages = Math.max(
    1,
    Math.ceil(reservationHistory.length / historyRows),
  );
  const loadCustomerDetail = async (phone: string) => {
    setHistoryPage(1);

    const token = localStorage.getItem("token");

    const res = await fetch(`https://okhrestaurant-ca7148d529c4.herokuapp.com/api/customers/${phone}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setSelectedCustomer(data);

    setShowDetailModal(true);
  };
  const exportCustomers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://okhrestaurant-ca7148d529c4.herokuapp.com/api/customers/download", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "customers.csv";

    a.click();

    window.URL.revokeObjectURL(url);
  };
  const exportCustomerHistory = async (phone: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://okhrestaurant-ca7148d529c4.herokuapp.com/api/customers/${phone}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `customer-${phone}.csv`;

    a.click();

    window.URL.revokeObjectURL(url);
  };
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return "↑↓";
    }

    return sortDirection === "asc" ? "↑" : "↓";
  };
  return (
    <div className="backofficeLayout">
      <BackofficeSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="backoffice__container">
        <button
          className="mobileMenuButton"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="backoffice__header">
          <h1>Customers</h1>

          <p>Manage customer information</p>
        </div>

        <div className="customer__filters">
          <input
            type="text"
            placeholder="Search customer name / phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setCurrentPage(1);
            }}
          />

          <button className="customer__exportButton" onClick={exportCustomers}>
            Export CSV
          </button>
        </div>

        <div className="backoffice__tableWrapper">
          <table className="backoffice__table">
            <thead>
              <tr>
                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("customerName")}
                >
                  Name {getSortIcon("customerName")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("phone")}
                >
                  Phone {getSortIcon("phone")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("totalReservations")}
                >
                  Total Reservations {getSortIcon("totalReservations")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("lastReservation")}
                >
                  Last Reservation {getSortIcon("lastReservation")}
                </th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="backoffice__empty">
                    <div className="backoffice__emptyContent">
                      <h3>No Customers Found</h3>

                      <p>No customer matches the search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => (
                  <tr key={customer.phone}>
                    <td>{customer.customerName}</td>

                    <td>{customer.phone}</td>

                    <td>{customer.email || "-"}</td>

                    <td>{customer.totalReservations}</td>

                    <td>{customer.lastReservation}</td>
                    <td>
                      <button
                        className="customer__viewButton"
                        onClick={() => loadCustomerDetail(customer.phone)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="customer__pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
        {showDetailModal && selectedCustomer && (
          <div className="menuManagement__modal">
            <div className="menuManagement__modalCard customerDetail">
              <h2>Customer Detail</h2>

              <div className="customerDetail__info">
                <div>
                  <strong>Phone</strong>

                  <span>{selectedCustomer.phone}</span>
                </div>

                <div>
                  <strong>Latest Email</strong>

                  <span>{selectedCustomer.email || "-"}</span>
                </div>

                <div>
                  <strong>Total Reservations</strong>

                  <span>{selectedCustomer.reservations?.length || 0}</span>
                </div>
              </div>

              <div className="customerDetail__lists">
                <div>
                  <h3>Names Used</h3>

                  <ul>
                    {selectedCustomer.names?.length > 0 ? (
                      selectedCustomer.names.map(
                        (name: string, index: number) => (
                          <li key={index}>{name}</li>
                        ),
                      )
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3>Emails Used</h3>

                  <ul>
                    {selectedCustomer.emails?.length > 0 ? (
                      selectedCustomer.emails.map(
                        (email: string, index: number) => (
                          <li key={index}>{email}</li>
                        ),
                      )
                    ) : (
                      <li>-</li>
                    )}
                  </ul>
                </div>
              </div>

              <h3>Reservation History</h3>

              <div className="customerDetail__history">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>

                      <th>Guests</th>

                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentHistory.map((booking: any) => (
                      <tr key={booking.id}>
                        <td>
                          {new Date(booking.bookingTime).toLocaleString()}
                        </td>

                        <td>{booking.numberOfPeople}</td>

                        <td>
                          <span
                            className={`backoffice__status ${booking.status.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="customerHistoryPagination">
                  <button
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(historyPage - 1)}
                  >
                    Previous
                  </button>

                  <span>
                    Page {historyPage} of {historyTotalPages}
                  </span>

                  <button
                    disabled={historyPage === historyTotalPages}
                    onClick={() => setHistoryPage(historyPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="menuManagement__modalActions">
                <button
                  className="customer__exportButton"
                  onClick={() => exportCustomerHistory(selectedCustomer.phone)}
                >
                  Export History
                </button>

                <button onClick={() => setShowDetailModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
