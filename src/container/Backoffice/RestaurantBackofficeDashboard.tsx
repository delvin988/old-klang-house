import React from "react";

import { useNavigate } from "react-router-dom";

import "./RestaurantBackofficeDashboard.css";
import BackofficeSidebar from "./component/backOfficeSidebar";

type Booking = {
  id: number;
  customerName: string;
  bookingTime: string;
  numberOfPeople: number;
  phone: string;
  status: string;
  wantMenu: boolean;
  selectedMenus: string;
  email: string;
};

const RestaurantBackofficeDashboard = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = React.useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState("ALL");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [upcomingPage, setUpcomingPage] = React.useState(1);
  const [sortField, setSortField] = React.useState("bookingTime");

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );
  const itemsPerPage = 5;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");

        navigate("/backoffice");

        return;
      }

      const data = await res.json();

      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUpcomingBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings/upcoming", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");

        navigate("/backoffice");

        return;
      }

      const data = await res.json();

      setUpcomingBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchBookings();

    fetchUpcomingBookings();

    const interval = setInterval(() => {
      fetchBookings();

      fetchUpcomingBookings();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  React.useEffect(() => {
    setUpcomingPage(1);
  }, [upcomingBookings]);
  const [confirmModal, setConfirmModal] = React.useState({
    open: false,
    bookingId: 0,
    status: "",
  });
  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings/${id}/status`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      if (res.status === 401) {
        localStorage.removeItem("token");

        navigate("/backoffice");

        return;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const openConfirmModal = (bookingId: number, status: string) => {
    setConfirmModal({
      open: true,
      bookingId,
      status,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      bookingId: 0,
      status: "",
    });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/backoffice");
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);

      setSortDirection("asc");
    }
  };
  const sortBookings = (bookings: Booking[]) => {
    return [...bookings].sort((a, b) => {
      let aValue: any;
      let bValue: any;

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

        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
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
  };
  const filteredBookings = sortBookings(
    selectedStatus === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedStatus),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / itemsPerPage),
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,

    currentPage * itemsPerPage,
  );
  const upcomingTotalPages = Math.max(
    1,
    Math.ceil(upcomingBookings.length / itemsPerPage),
  );

  const paginatedUpcomingBookings = sortBookings(upcomingBookings).slice(
    (upcomingPage - 1) * itemsPerPage,
    upcomingPage * itemsPerPage,
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1>Dashboard</h1>

              <p>Today Restaurant Reservations</p>
              <div className="dashboard__filters">
                <button
                  className={selectedStatus === "ALL" ? "active" : ""}
                  onClick={() => {
                    setSelectedStatus("ALL");
                    setCurrentPage(1);
                  }}
                >
                  All
                </button>

                <button
                  className={selectedStatus === "PENDING" ? "active" : ""}
                  onClick={() => {
                    setSelectedStatus("PENDING");
                    setCurrentPage(1);
                  }}
                >
                  Pending
                </button>

                <button
                  className={selectedStatus === "CONFIRMED" ? "active" : ""}
                  onClick={() => {
                    setSelectedStatus("CONFIRMED");
                    setCurrentPage(1);
                  }}
                >
                  Confirmed
                </button>

                <button
                  className={selectedStatus === "DONE" ? "active" : ""}
                  onClick={() => {
                    setSelectedStatus("DONE");
                    setCurrentPage(1);
                  }}
                >
                  Done
                </button>

                <button
                  className={selectedStatus === "CANCELLED" ? "active" : ""}
                  onClick={() => {
                    setSelectedStatus("CANCELLED");
                    setCurrentPage(1);
                  }}
                >
                  Cancelled
                </button>
              </div>
            </div>
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
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th>Menu</th>
                <th
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIcon("status")}
                </th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="backoffice__empty">
                    <div className="backoffice__emptyContent">
                      <h3>No Data</h3>

                      <p>
                        There are currently no reservations with this filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div>
                        <strong>{booking.customerName}</strong>

                        <div className="backoffice__bookingId">
                          #{booking.id}
                        </div>
                      </div>
                    </td>
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

                    <td>{booking.numberOfPeople} Guests</td>

                    <td>{booking.phone}</td>

                    <td>
                      {booking.email ? booking.email : "No Email Provided"}
                    </td>

                    <td>
                      {booking.wantMenu && booking.selectedMenus ? (
                        <div className="backoffice__menuList">
                          {booking.selectedMenus
                            .split(";")
                            .map((menu, index) => {
                              const [id, name, qty] = menu.split("|");

                              return (
                                <div
                                  key={index}
                                  className="backoffice__menuItem"
                                >
                                  <span className="menuName">{name}</span>

                                  <span className="menuQty">x{qty}</span>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        "No Menu Selected"
                      )}
                    </td>

                    <td>
                      <span
                        className={`backoffice__status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="backoffice__actions">
                        {booking.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                openConfirmModal(booking.id, "CONFIRMED")
                              }
                            >
                              Confirm
                            </button>

                            <button
                              className="cancel"
                              onClick={() =>
                                openConfirmModal(booking.id, "CANCELLED")
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <>
                            <button
                              onClick={() =>
                                openConfirmModal(booking.id, "DONE")
                              }
                            >
                              Done
                            </button>

                            <button
                              className="cancel"
                              onClick={() =>
                                openConfirmModal(booking.id, "CANCELLED")
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {booking.status === "DONE" && (
                          <button
                            className="cancel"
                            onClick={() =>
                              openConfirmModal(booking.id, "CANCELLED")
                            }
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === "CANCELLED" && (
                          <button
                            onClick={() => openConfirmModal(booking.id, "DONE")}
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="backoffice__pagination">
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
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <div className="backoffice__header">
            <h1>Upcoming Reservations</h1>

            <p>Future reservations</p>
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
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>
                  <th>Menu</th>
                  <th
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {upcomingBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="backoffice__empty">
                      <div className="backoffice__emptyContent">
                        <h3>No Upcoming Reservations</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUpcomingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div>
                          <strong>{booking.customerName}</strong>

                          <div className="backoffice__bookingId">
                            #{booking.id}
                          </div>
                        </div>
                      </td>
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

                      <td>{booking.numberOfPeople} Guests</td>

                      <td>{booking.phone}</td>

                      <td>
                        {booking.email ? booking.email : "No Email Provided"}
                      </td>

                      <td>
                        {booking.wantMenu && booking.selectedMenus ? (
                          <div className="backoffice__menuList">
                            {booking.selectedMenus
                              .split(";")
                              .map((menu, index) => {
                                const [id, name, qty] = menu.split("|");

                                return (
                                  <div
                                    key={index}
                                    className="backoffice__menuItem"
                                  >
                                    <span className="menuName">{name}</span>

                                    <span className="menuQty">x{qty}</span>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          "No Menu Selected"
                        )}
                      </td>

                      <td>
                        <span
                          className={`backoffice__status ${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td>
                        <div className="backoffice__actions">
                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() =>
                                  openConfirmModal(booking.id, "CONFIRMED")
                                }
                              >
                                Confirm
                              </button>

                              <button
                                className="cancel"
                                onClick={() =>
                                  openConfirmModal(booking.id, "CANCELLED")
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking.status === "CONFIRMED" && (
                            <>
                              <button
                                onClick={() =>
                                  openConfirmModal(booking.id, "DONE")
                                }
                              >
                                Done
                              </button>

                              <button
                                className="cancel"
                                onClick={() =>
                                  openConfirmModal(booking.id, "CANCELLED")
                                }
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {booking.status === "DONE" && (
                            <button
                              className="cancel"
                              onClick={() =>
                                openConfirmModal(booking.id, "CANCELLED")
                              }
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status === "CANCELLED" && (
                            <button
                              onClick={() =>
                                openConfirmModal(booking.id, "DONE")
                              }
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="backoffice__pagination">
              <button
                disabled={upcomingPage === 1}
                onClick={() => setUpcomingPage(upcomingPage - 1)}
              >
                Previous
              </button>

              <span>
                Page {upcomingPage} of {upcomingTotalPages}
              </span>

              <button
                disabled={upcomingPage === upcomingTotalPages}
                onClick={() => setUpcomingPage(upcomingPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {confirmModal.open && (
          <div className="confirmModalOverlay">
            <div className="confirmModal">
              <h3>Confirm Action</h3>

              <p>
                Are you sure you want to change this reservation status to{" "}
                <strong>{confirmModal.status}</strong>?
              </p>

              <div className="confirmModal__actions">
                <button className="secondary" onClick={closeConfirmModal}>
                  No
                </button>

                <button
                  onClick={async () => {
                    await updateStatus(
                      confirmModal.bookingId,
                      confirmModal.status,
                    );

                    closeConfirmModal();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantBackofficeDashboard;
