import React from "react";
import { useNavigate } from "react-router-dom";

import BackofficeSidebar from "../component/backOfficeSidebar";

import "../RestaurantBackofficeDashboard.css";
import "./OrderHistory.css";

type OrderStatus =
    | "NEW"
    | "PREPARING"
    | "SERVED"
    | "CANCELLED";

type RestaurantTable = {
    id: number;
    tableNumber: string;
};

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

const API_BASE_URL = "https://okhrestaurant-ca7148d529c4.herokuapp.com";
const ORDERS_PER_PAGE = 10;
const OrderHistory = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] =
        React.useState(false);

    const [fromDate, setFromDate] =
        React.useState("");

    const [toDate, setToDate] =
        React.useState("");

    const [selectedTableId, setSelectedTableId] =
        React.useState("");

    const [selectedStatus, setSelectedStatus] =
        React.useState("");

    const [tables, setTables] =
        React.useState<RestaurantTable[]>([]);

    const [orders, setOrders] =
        React.useState<Order[]>([]);

    const [loading, setLoading] =
        React.useState(false);

    const [tablesLoading, setTablesLoading] =
        React.useState(true);

    const [searched, setSearched] =
        React.useState(false);
    const [currentPage, setCurrentPage] =
        React.useState(1);
    const getHeaders = () => {
        const token =
            localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`,
        };
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/backoffice");
    };

    /*
     * =========================
     * LOAD TABLES
     * =========================
     */

    const loadTables = async () => {
        try {
            setTablesLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/tables`,
                {
                    headers: getHeaders(),
                },
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/backoffice");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to load tables.",
                );
            }

            const data: RestaurantTable[] =
                await response.json();

            setTables(data);

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to load tables.",
            );

        } finally {
            setTablesLoading(false);
        }
    };

    React.useEffect(() => {
        loadTables();
    }, []);

    /*
     * =========================
     * SEARCH HISTORY
     * =========================
     */

    const searchHistory = async () => {
        if (!fromDate || !toDate) {
            alert(
                "Please select both From Date and To Date.",
            );

            return;
        }

        if (fromDate > toDate) {
            alert(
                "From Date cannot be after To Date.",
            );

            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams();

            params.set(
                "fromDate",
                fromDate,
            );

            params.set(
                "toDate",
                toDate,
            );

            if (selectedTableId) {
                params.set(
                    "tableId",
                    selectedTableId,
                );
            }

            if (selectedStatus) {
                params.set(
                    "status",
                    selectedStatus,
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/api/orders/history?${params.toString()}`,
                {
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
                    "Failed to load order history.",
                );
            }

            setOrders(data);
            setCurrentPage(1);
            setSearched(true);

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to load order history.",
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * =========================
     * CLEAR
     * =========================
     */
    const updateOrderStatus = async (
        orderId: number,
        status: "PREPARING" | "SERVED" | "CANCELLED",
    ) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/orders/${orderId}/status`,
                {
                    method: "PUT",
                    headers: {
                        ...getHeaders(),
                        "Content-Type": "application/json",
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update order status.",
                );
            }

            await searchHistory();

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to update order status.",
            );
        }
    };
    const cancelOrderItem = async (
        orderId: number,
        itemId: number,
    ) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/orders/${orderId}/items/${itemId}/cancel`,
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

            await searchHistory();

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to cancel order item.",
            );
        }
    };
    const clearSearch = () => {
        setFromDate("");
        setToDate("");
        setSelectedTableId("");
        setSelectedStatus("");

        setOrders([]);
        setCurrentPage(1);
        setSearched(false);
    };

    /*
     * =========================
     * FORMAT
     * =========================
     */

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
                    timeZone: "Asia/Jakarta",
                },
            ),

            time: value.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
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
    const totalPages = Math.ceil(
        orders.length / ORDERS_PER_PAGE,
    );

    const startIndex =
        (currentPage - 1) *
        ORDERS_PER_PAGE;

    const endIndex =
        startIndex +
        ORDERS_PER_PAGE;

    const currentOrders =
        orders.slice(
            startIndex,
            endIndex,
        );

    const goToPage = (page: number) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);
    };
    /*
     * =========================
     * UI
     * =========================
     */

    return (
        <div className="backofficeLayout">

            <BackofficeSidebar
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <div className="backoffice__container orderHistory">

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
                        Order History
                    </h1>

                    <p>
                        View previous customer orders.
                    </p>

                </div>

                {/* FILTER */}

                <div className="orderHistory__filterCard">

                    <div className="orderHistory__filterRow">

                        <div className="orderHistory__filterGroup">

                            <label>
                                From Date
                            </label>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value,
                                    )
                                }
                            />

                        </div>

                        <div className="orderHistory__filterGroup">

                            <label>
                                To Date
                            </label>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value,
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="orderHistory__filterRow">

                        <div className="orderHistory__filterGroup">

                            <label>
                                Table
                            </label>

                            <select
                                value={selectedTableId}
                                onChange={(e) =>
                                    setSelectedTableId(
                                        e.target.value,
                                    )
                                }
                                disabled={tablesLoading}
                            >
                                <option value="">
                                    All Tables
                                </option>

                                {tables.map((table) => (
                                    <option
                                        key={table.id}
                                        value={table.id}
                                    >
                                        Table{" "}
                                        {table.tableNumber}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="orderHistory__filterGroup">

                            <label>
                                Status
                            </label>

                            <select
                                value={selectedStatus}
                                onChange={(e) =>
                                    setSelectedStatus(
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="NEW">
                                    New
                                </option>

                                <option value="PREPARING">
                                    Preparing
                                </option>

                                <option value="SERVED">
                                    Served
                                </option>

                                <option value="CANCELLED">
                                    Cancelled
                                </option>
                            </select>

                        </div>

                    </div>

                    <div className="orderHistory__filterActions">

                        <button
                            className="orderHistory__searchButton"
                            onClick={searchHistory}
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : "Search"}
                        </button>

                        <button
                            className="orderHistory__clearButton"
                            onClick={clearSearch}
                            disabled={loading}
                        >
                            Clear
                        </button>

                    </div>

                </div>

                {/* RESULT */}

                {!searched ? (

                    <div className="orderHistory__empty">

                        <h3>
                            Select Filters
                        </h3>

                        <p>
                            Choose a date range,
                            table, or status to
                            search order history.
                        </p>

                    </div>

                ) : loading ? (

                    <div className="orderHistory__empty">

                        <h3>
                            Loading Order History...
                        </h3>

                    </div>

                ) : orders.length === 0 ? (

                    <div className="orderHistory__empty">

                        <h3>
                            No Orders Found
                        </h3>

                        <p>
                            There are no orders matching
                            your selected filters.
                        </p>

                    </div>

                ) : (

                    <>
                        <div className="orderHistory__resultHeader">

                            <div>
                                <h2>
                                    Order History
                                </h2>

                                <span>
                                    {fromDate} →{" "}
                                    {toDate}
                                </span>
                            </div>

                            <strong>
                                {orders.length} order
                                {orders.length !== 1
                                    ? "s"
                                    : ""}
                            </strong>

                        </div>

                        <div className="orderHistory__list">

                            {currentOrders.map((order) => {

                                const dateTime =
                                    formatDateTime(
                                        order.createdAt,
                                    );

                                return (
                                    <div
                                        key={order.orderId}
                                        className="orderHistory__card"
                                    >

                                        <div className="orderHistory__cardHeader">

                                            <div>

                                                <span className="orderHistory__smallLabel">
                                                    ORDER #
                                                    {order.orderId}
                                                </span>

                                                <h2>
                                                    Table{" "}
                                                    {order.tableNumber}
                                                </h2>

                                            </div>

                                            <span
                                                className={`orderHistory__status ${order.status.toLowerCase()}`}
                                            >
                                                {getStatusLabel(
                                                    order.status,
                                                )}
                                            </span>

                                        </div>

                                        <div className="orderHistory__info">

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

                                        <div className="orderHistory__items">

                                            {order.items.map(
                                                (item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`orderHistory__item ${item.status === "CANCELLED"
                                                            ? "cancelled"
                                                            : ""
                                                            }`}
                                                    >
                                                        <div>

                                                            <div className="orderHistory__itemMain">

                                                                <span>
                                                                    x{item.quantity}
                                                                </span>

                                                                <strong>
                                                                    {item.menuName}
                                                                </strong>

                                                                {item.status === "CANCELLED" && (
                                                                    <span className="orderHistory__itemStatus cancelled">
                                                                        CANCELLED
                                                                    </span>
                                                                )}
                                                                {(order.status === "NEW" ||
                                                                    order.status === "PREPARING") &&
                                                                    item.status === "ACTIVE" && (
                                                                        <button
                                                                            type="button"
                                                                            className="orderHistory__itemCancelButton"
                                                                            onClick={() =>
                                                                                cancelOrderItem(
                                                                                    order.orderId,
                                                                                    item.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    )}

                                                            </div>

                                                            {item.notes && (
                                                                <p>
                                                                    Note: {item.notes}
                                                                </p>
                                                            )}

                                                        </div>

                                                        <strong
                                                            className={
                                                                item.status === "CANCELLED"
                                                                    ? "cancelled"
                                                                    : ""
                                                            }
                                                        >
                                                            Rp{" "}
                                                            {new Intl.NumberFormat(
                                                                "id-ID",
                                                            ).format(
                                                                item.subtotal,
                                                            )}
                                                        </strong>

                                                    </div>
                                                ),
                                            )}

                                        </div>

                                        <div className="orderHistory__footer">

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
                                        {order.status === "NEW" && (
                                            <div className="orderHistory__actions">

                                                <button
                                                    className="orderHistory__actionButton preparing"
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.orderId,
                                                            "PREPARING",
                                                        )
                                                    }
                                                >
                                                    Preparing
                                                </button>

                                                <button
                                                    className="orderHistory__actionButton cancel"
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.orderId,
                                                            "CANCELLED",
                                                        )
                                                    }
                                                >
                                                    Cancelled
                                                </button>

                                            </div>
                                        )}

                                        {order.status === "PREPARING" && (
                                            <div className="orderHistory__actions">

                                                <button
                                                    className="orderHistory__actionButton served"
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.orderId,
                                                            "SERVED",
                                                        )
                                                    }
                                                >
                                                    Served
                                                </button>

                                                <button
                                                    className="orderHistory__actionButton cancel"
                                                    onClick={() =>
                                                        updateOrderStatus(
                                                            order.orderId,
                                                            "CANCELLED",
                                                        )
                                                    }
                                                >
                                                    Cancelled
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>
                        {totalPages > 1 && (
                            <div className="orderHistory__pagination">

                                <div className="orderHistory__paginationInfo">
                                    Showing{" "}
                                    <strong>
                                        {startIndex + 1}
                                    </strong>
                                    {" – "}
                                    <strong>
                                        {Math.min(
                                            endIndex,
                                            orders.length,
                                        )}
                                    </strong>
                                    {" of "}
                                    <strong>
                                        {orders.length}
                                    </strong>
                                    {" orders"}
                                </div>

                                <div className="orderHistory__paginationControls">

                                    <button
                                        className="orderHistory__pageButton"
                                        onClick={() =>
                                            goToPage(
                                                currentPage - 1,
                                            )
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                    >
                                        ‹
                                    </button>

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            className={`orderHistory__pageButton ${currentPage === page
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                goToPage(page)
                                            }
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        className="orderHistory__pageButton"
                                        onClick={() =>
                                            goToPage(
                                                currentPage + 1,
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                    >
                                        ›
                                    </button>

                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default OrderHistory;