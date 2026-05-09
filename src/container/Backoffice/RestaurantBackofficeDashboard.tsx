import React from "react";
import "./RestaurantBackofficeDashboard.css";

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
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings/today");

      const data = await res.json();

      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="backoffice">
      <div className="backoffice__container">
        <div className="backoffice__header">
          <h1>Backoffice Dashboard</h1>

          <p>Today Restaurant Reservations</p>
        </div>

        <div className="backoffice__tableWrapper">
          <table className="backoffice__table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Menu</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div>
                      <strong>{booking.customerName}</strong>

                      <div className="backoffice__bookingId">#{booking.id}</div>
                    </div>
                  </td>

                  <td>
                    {new Date(booking.bookingTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>{booking.numberOfPeople} Guests</td>

                  <td>{booking.phone}</td>
                  <td>{booking.email ? booking.email : "No Email Provided"}</td>
                  <td>
                    {booking.wantMenu && booking.selectedMenus ? (
                      <div className="backoffice__menuList">
                        {booking.selectedMenus.split(";").map((menu, index) => {
                          const [id, name, qty] = menu.split("|");

                          return (
                            <div key={index} className="backoffice__menuItem">
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
                      <button
                        onClick={() => updateStatus(booking.id, "CONFIRMED")}
                      >
                        Confirm
                      </button>

                      <button onClick={() => updateStatus(booking.id, "DONE")}>
                        Done
                      </button>

                      <button
                        className="cancel"
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBackofficeDashboard;
