import React from "react";

import "./ReservationManagement.css";
import "../RestaurantBackofficeDashboard.css";

import BackofficeSidebar from "../component/backOfficeSidebar";

import { useNavigate } from "react-router-dom";

const ReservationManagement = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [dateFrom, setDateFrom] = React.useState(today);

  const [dateTo, setDateTo] = React.useState(today);

  const [bookings, setBookings] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [sortField, setSortField] = React.useState("bookingTime");

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/backoffice");
  };
  React.useEffect(() => {
    searchReservations(today, today);
  }, []);
  const searchReservations = async (startDate: string, endDate: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://okhrestaurant-ca7148d529c4.herokuapp.com/api/bookings/reservation?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    setBookings(data);
    setCurrentPage(1);
    setStatusFilter("ALL");
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);

      setSortDirection("asc");
    }
  };
  const filteredBookings = (
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((booking: any) => booking.status === statusFilter)
  ).sort((a: any, b: any) => {
    let aValue;
    let bValue;

    switch (sortField) {
      case "customerName":
        aValue = a.customerName;
        bValue = b.customerName;
        break;

      case "bookingTime":
        aValue = new Date(a.bookingTime).getTime();

        bValue = new Date(b.bookingTime).getTime();
        break;

      case "numberOfPeople":
        aValue = a.numberOfPeople;
        bValue = b.numberOfPeople;
        break;

      case "phone":
        aValue = a.phone;
        bValue = b.phone;
        break;

      case "status":
        aValue = a.status;
        bValue = b.status;
        break;

      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }

    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }

    return 0;
  });
  const lastIndex = currentPage * rowsPerPage;

  const firstIndex = lastIndex - rowsPerPage;

  const currentBookings = filteredBookings.slice(firstIndex, lastIndex);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / rowsPerPage),
  );
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
          <h1>Reservations History</h1>
        </div>

        <div className="reservation__filters">
          <div className="reservation__field">
            <label>Date From</label>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="reservation__field">
            <label>Date To</label>

            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            className="reservation__searchButton"
            onClick={() => {
              if (dateFrom > dateTo) {
                alert("Date From cannot be later than Date To");

                return;
              }

              searchReservations(dateFrom, dateTo);
            }}
          >
            Search
          </button>
          <div className="reservation__statusFilters">
            <button
              className={statusFilter === "ALL" ? "active" : ""}
              onClick={() => setStatusFilter("ALL")}
            >
              All
            </button>

            <button
              className={statusFilter === "PENDING" ? "active" : ""}
              onClick={() => setStatusFilter("PENDING")}
            >
              Pending
            </button>

            <button
              className={statusFilter === "CONFIRMED" ? "active" : ""}
              onClick={() => setStatusFilter("CONFIRMED")}
            >
              Confirmed
            </button>

            <button
              className={statusFilter === "DONE" ? "active" : ""}
              onClick={() => setStatusFilter("DONE")}
            >
              Done
            </button>

            <button
              className={statusFilter === "CANCELLED" ? "active" : ""}
              onClick={() => setStatusFilter("CANCELLED")}
            >
              Cancelled
            </button>
          </div>
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
                  Customer {getSortIcon("customerName")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("bookingTime")}
                >
                  Date {getSortIcon("bookingTime")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("bookingTime")}
                >
                  Time {getSortIcon("bookingTime")}
                </th>

                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("numberOfPeople")}
                >
                  Guests {getSortIcon("numberOfPeople")}
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
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 || filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="backoffice__empty">
                    <div className="backoffice__emptyContent">
                      <h3>No Reservations Found</h3>

                      <p>No reservations match the selected criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking: any) => (
                  <tr key={booking.id}>
                    <td>{booking.customerName}</td>

                    <td>
                      {new Date(booking.bookingTime).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </td>

                    <td>
                      {new Date(booking.bookingTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td>{booking.numberOfPeople}</td>

                    <td>{booking.phone}</td>

                    <td>
                      <span
                        className={`backoffice__status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="reservation__pagination">
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
      </div>
    </div>
  );
};

export default ReservationManagement;
