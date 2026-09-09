import React from "react";
import { useNavigate } from "react-router-dom";

import BackofficeSidebar from "../component/backOfficeSidebar";

import "../RestaurantBackofficeDashboard.css";
import "./OrderManagement.css";

type OrderStatus =
  | "NEW"
  | "PREPARING"
  | "SERVED"
  | "CANCELLED";

type OrderItem = {
  id: number;
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
  notes: string | null;
  subtotal: number;
  status: "ACTIVE" | "CANCELLED";

};

type Order = {
  orderId: number;
  sessionId: number;
  tableNumber: string;
  status: OrderStatus;
  subtotal: number;
  createdAt: string;
  items: OrderItem[];
};

type FilterStatus =
  | "NEW"
  | "PREPARING"
  | "SERVED"
  | "CANCELLED";

const API_BASE_URL = "https://okhrestaurant-ca7148d529c4.herokuapp.com";

const OrderManagement = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    React.useState(false);

  const [selectedStatus, setSelectedStatus] =
    React.useState<FilterStatus>("NEW");

  const [orders, setOrders] =
    React.useState<Order[]>([]);
  const [statusCounts, setStatusCounts] =
    React.useState<Record<FilterStatus, number>>({
      NEW: 0,
      PREPARING: 0,
      SERVED: 0,
      CANCELLED: 0,
    });
  const [loading, setLoading] =
    React.useState(true);

  const [updatingOrderId, setUpdatingOrderId] =
    React.useState<number | null>(null);

  const [cancelModalOrder, setCancelModalOrder] =
    React.useState<Order | null>(null);

  const [cancelModalItem, setCancelModalItem] =
    React.useState<{
      order: Order;
      item: OrderItem;
    } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/backoffice");
  };

  const getHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const loadOrders = async (
    status: FilterStatus = selectedStatus,
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/orders?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/backoffice");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load orders",
        );
      }

      const data: Order[] =
        await response.json();

      setOrders(data);

    } catch (error) {

      console.error(
        "Failed to load orders:",
        error,
      );

    } finally {

      setLoading(false);

    }
  };
  const loadStatusCounts = async () => {
    try {
      const statuses: FilterStatus[] = [
        "NEW",
        "PREPARING",
        "SERVED",
        "CANCELLED",
      ];

      const results = await Promise.all(
        statuses.map(async (status) => {
          const token =
            localStorage.getItem("token");

          const response = await fetch(
            `${API_BASE_URL}/api/orders?status=${status}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error(
              `Failed to load ${status} orders`,
            );
          }

          const data: Order[] =
            await response.json();

          return {
            status,
            count: data.length,
          };
        }),
      );

      const counts = {
        NEW: 0,
        PREPARING: 0,
        SERVED: 0,
        CANCELLED: 0,
      } as Record<FilterStatus, number>;

      results.forEach((result) => {
        counts[result.status] =
          result.count;
      });

      setStatusCounts(counts);

    } catch (error) {
      console.error(
        "Failed to load order counts:",
        error,
      );
    }
  };
  React.useEffect(() => {
    loadOrders(selectedStatus);
    loadStatusCounts();

    const interval =
      setInterval(() => {
        loadOrders(selectedStatus);
        loadStatusCounts();
      }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedStatus]);

  const changeStatus = async (
    orderId: number,
    status: OrderStatus,
  ) => {

    try {

      setUpdatingOrderId(orderId);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            ...getHeaders(),
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/backoffice");
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update order status",
        );
      }

      /*
       * Reload current filter.
       *
       * Example:
       * NEW → PREPARING
       *
       * Order will disappear from
       * NEW immediately.
       */

      await loadOrders(
        selectedStatus,
      );

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update order.",
      );

    } finally {

      setUpdatingOrderId(null);

    }
  };

  const formatPrice = (
    price: number,
  ) => {

    return new Intl.NumberFormat(
      "id-ID",
    ).format(price);
  };

  const formatDateTime = (
    date: string,
  ) => {

    const value =
      new Date(date);

    return {
      date: value.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ),

      time: value.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
    };
  };

  const getStatusLabel = (
    status: OrderStatus,
  ) => {

    switch (status) {

      case "NEW":
        return "New";

      case "PREPARING":
        return "Preparing";

      case "SERVED":
        return "Served";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
  };
  const confirmCancelOrder = async () => {
    if (!cancelModalOrder) {
      return;
    }

    await changeStatus(
      cancelModalOrder.orderId,
      "CANCELLED",
    );

    setCancelModalOrder(null);
  };

  const cancelOrderItem = async () => {
    if (!cancelModalItem) {
      return;
    }

    const {
      order,
      item,
    } = cancelModalItem;

    try {
      setUpdatingOrderId(
        order.orderId,
      );

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${order.orderId}/items/${item.id}/cancel`,
        {
          method: "PUT",
          headers: getHeaders(),
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/backoffice");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to cancel order item.",
        );
      }

      setCancelModalItem(null);

      await loadOrders(
        selectedStatus,
      );

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel order item.",
      );

    } finally {
      setUpdatingOrderId(null);
    }
  };
  const getStatusCount = (
    status: FilterStatus,
  ) => {
    return orders.filter(
      (order) => order.status === status,
    ).length;
  };
  const getNextAction = (
    order: Order,
  ) => {

    if (order.status === "NEW") {
      return (
        <div className="orderManagement__actions">
          <button
            className="orderManagement__actionButton"
            disabled={
              updatingOrderId === order.orderId
            }
            onClick={() =>
              changeStatus(
                order.orderId,
                "PREPARING",
              )
            }
          >
            {updatingOrderId === order.orderId
              ? "Updating..."
              : "Start Preparing"}
          </button>

          <button
            className="orderManagement__actionButton cancel"
            disabled={
              updatingOrderId === order.orderId
            }
            onClick={() =>
              setCancelModalOrder(order)
            }
          >
            {updatingOrderId === order.orderId
              ? "Updating..."
              : "Cancel Order"}
          </button>
        </div>
      );
    }

    if (order.status === "PREPARING") {
      return (
        <div className="orderManagement__actions">
          <button
            className="orderManagement__actionButton"
            disabled={
              updatingOrderId === order.orderId
            }
            onClick={() =>
              changeStatus(
                order.orderId,
                "SERVED",
              )
            }
          >
            {updatingOrderId === order.orderId
              ? "Updating..."
              : "Mark as Served"}
          </button>

          <button
            className="orderManagement__actionButton cancel"
            disabled={
              updatingOrderId === order.orderId
            }
            onClick={() =>
              setCancelModalOrder(order)
            }
          >
            {updatingOrderId === order.orderId
              ? "Updating..."
              : "Cancel Order"}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="backofficeLayout">

      <BackofficeSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="backoffice__container orderManagement">

        <button
          className="mobileMenuButton"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

        {/* HEADER */}

        <div className="backoffice__header">
          <h1>
            Order Management
          </h1>

          <p>
            Today's customer orders
          </p>

          <span className="orderManagement__todayLabel">
            Today •{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            }).format(new Date())}
          </span>
        </div>

        {/* FILTERS */}

        <div className="orderManagement__filters">

          {(
            [
              "NEW",
              "PREPARING",
              "SERVED",
              "CANCELLED",
            ] as FilterStatus[]
          ).map((status) => (
            <button
              key={status}
              className={
                selectedStatus === status
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedStatus(status)
              }
            >
              {getStatusLabel(status)}{" "}
              ({statusCounts[status]})
            </button>
          ))}

        </div>

        {/* ORDER LIST */}

        {loading ? (

          <div className="orderManagement__empty">

            <h3>
              Loading Orders...
            </h3>

          </div>

        ) : orders.length === 0 ? (

          <div className="orderManagement__empty">

            <h3>
              No {getStatusLabel(
                selectedStatus,
              )} Orders
            </h3>

            <p>
              There are currently no orders
              with this status.
            </p>

          </div>

        ) : (

          <div className="orderManagement__list">

            {orders.map((order) => {

              const dateTime =
                formatDateTime(
                  order.createdAt,
                );

              return (
                <div
                  key={order.orderId}
                  className="orderManagement__card"
                >

                  {/* CARD HEADER */}

                  <div className="orderManagement__cardHeader">

                    <div>

                      <span className="orderManagement__smallLabel">
                        ORDER #{order.orderId}
                      </span>

                      <h2>
                        Table{" "}
                        {order.tableNumber}
                      </h2>

                    </div>

                    <span
                      className={`orderManagement__status ${order.status.toLowerCase()}`}
                    >
                      {getStatusLabel(
                        order.status,
                      )}
                    </span>

                  </div>

                  {/* TIME */}

                  <div className="orderManagement__orderInfo">

                    <span>
                      {dateTime.date}
                    </span>

                    <span>
                      {dateTime.time}
                    </span>

                    <span>
                      Session #
                      {order.sessionId}
                    </span>

                  </div>

                  {/* ITEMS */}

                  <div className="orderManagement__items">

                    {order.items.map(
                      (item) => (

                        <div
                          key={item.id}
                          className={`orderManagement__item ${item.status === "CANCELLED"
                            ? "cancelled"
                            : ""
                            }`}
                        >

                          <div className="orderManagement__itemMain">

                            <div className="orderManagement__itemQuantity">
                              x{item.quantity}
                            </div>

                            <div className="orderManagement__itemContent">

                              <div className="orderManagement__itemNameRow">

                                <strong>
                                  {item.menuName}
                                </strong>

                                {item.status === "CANCELLED" && (
                                  <span className="orderManagement__itemStatus cancelled">
                                    CANCELLED
                                  </span>
                                )}

                              </div>

                              {item.notes && (
                                <p>
                                  Note: {item.notes}
                                </p>
                              )}

                              {item.status === "ACTIVE" &&
                                (order.status === "NEW" ||
                                  order.status === "PREPARING") && (
                                  <button
                                    className="orderManagement__cancelItemButton"
                                    onClick={() =>
                                      setCancelModalItem({
                                        order,
                                        item,
                                      })
                                    }
                                    disabled={
                                      updatingOrderId ===
                                      order.orderId
                                    }
                                  >
                                    Cancel Item
                                  </button>
                                )}

                            </div>

                          </div>

                          <span
                            className={`orderManagement__itemPrice ${item.status === "CANCELLED"
                              ? "cancelled"
                              : ""
                              }`}
                          >
                            Rp{" "}
                            {formatPrice(
                              item.subtotal,
                            )}
                          </span>

                        </div>

                      ),
                    )}

                  </div>

                  {/* FOOTER */}

                  <div className="orderManagement__cardFooter">

                    <div className="orderManagement__total">

                      <span>
                        Subtotal
                      </span>

                      <strong>
                        Rp{" "}
                        {formatPrice(
                          order.subtotal,
                        )}
                      </strong>

                    </div>

                    <div>
                      {getNextAction(
                        order,
                      )}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}
        {cancelModalOrder && (
          <div
            className="orderManagement__modalOverlay"
            onClick={() =>
              setCancelModalOrder(null)
            }
          >
            <div
              className="orderManagement__cancelModal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="orderManagement__modalHeader">
                <div>
                  <span className="orderManagement__modalSmallLabel">
                    CANCEL ORDER
                  </span>

                  <h2>
                    Order #{cancelModalOrder.orderId}
                  </h2>
                </div>

                <button
                  className="orderManagement__modalClose"
                  onClick={() =>
                    setCancelModalOrder(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="orderManagement__cancelWarning">
                Are you sure you want to cancel this order?
              </div>

              <div className="orderManagement__cancelInfo">
                <div>
                  <span>Table</span>
                  <strong>
                    {cancelModalOrder.tableNumber}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    {getStatusLabel(
                      cancelModalOrder.status,
                    )}
                  </strong>
                </div>
              </div>

              <div className="orderManagement__cancelItems">
                {cancelModalOrder.items
                  .filter(
                    (item) =>
                      item.status === "ACTIVE",
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="orderManagement__cancelItem"
                    >
                      <span>
                        {item.quantity} ×{" "}
                        {item.menuName}
                      </span>

                      <strong>
                        Rp{" "}
                        {formatPrice(
                          item.subtotal,
                        )}
                      </strong>
                    </div>
                  ),
                  )}
              </div>

              <div className="orderManagement__cancelTotal">
                <span>Subtotal</span>

                <strong>
                  Rp{" "}
                  {formatPrice(
                    cancelModalOrder.subtotal,
                  )}
                </strong>
              </div>

              <div className="orderManagement__modalActions">
                <button
                  className="orderManagement__modalButton secondary"
                  onClick={() =>
                    setCancelModalOrder(null)
                  }
                  disabled={
                    updatingOrderId ===
                    cancelModalOrder.orderId
                  }
                >
                  Keep Order
                </button>

                <button
                  className="orderManagement__modalButton danger"
                  onClick={confirmCancelOrder}
                  disabled={
                    updatingOrderId ===
                    cancelModalOrder.orderId
                  }
                >
                  {updatingOrderId ===
                    cancelModalOrder.orderId
                    ? "Cancelling..."
                    : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
        {cancelModalItem && (
          <div
            className="orderManagement__modalOverlay"
            onClick={() =>
              setCancelModalItem(null)
            }
          >
            <div
              className="orderManagement__cancelModal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="orderManagement__modalHeader">

                <div>

                  <span className="orderManagement__modalSmallLabel">
                    CANCEL ITEM
                  </span>

                  <h2>
                    {cancelModalItem.item.menuName}
                  </h2>

                </div>

                <button
                  className="orderManagement__modalClose"
                  onClick={() =>
                    setCancelModalItem(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="orderManagement__cancelWarning">
                Are you sure you want to cancel this item?
              </div>

              <div className="orderManagement__cancelInfo">

                <div>
                  <span>Order</span>
                  <strong>
                    #
                    {cancelModalItem.order.orderId}
                  </strong>
                </div>

                <div>
                  <span>Table</span>
                  <strong>
                    {cancelModalItem.order.tableNumber}
                  </strong>
                </div>

              </div>

              <div className="orderManagement__cancelItemPreview">

                <div>
                  <span>
                    {cancelModalItem.item.quantity} ×{" "}
                    {cancelModalItem.item.menuName}
                  </span>

                  <strong>
                    Rp{" "}
                    {formatPrice(
                      cancelModalItem.item.subtotal,
                    )}
                  </strong>
                </div>

                {cancelModalItem.item.notes && (
                  <small>
                    Note:{" "}
                    {cancelModalItem.item.notes}
                  </small>
                )}

              </div>

              <div className="orderManagement__modalActions">

                <button
                  className="orderManagement__modalButton secondary"
                  onClick={() =>
                    setCancelModalItem(null)
                  }
                  disabled={
                    updatingOrderId ===
                    cancelModalItem.order.orderId
                  }
                >
                  Keep Item
                </button>

                <button
                  className="orderManagement__modalButton danger"
                  onClick={cancelOrderItem}
                  disabled={
                    updatingOrderId ===
                    cancelModalItem.order.orderId
                  }
                >
                  {updatingOrderId ===
                    cancelModalItem.order.orderId
                    ? "Cancelling..."
                    : "Confirm Cancel"}
                </button>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;