import React from "react";
import { useNavigate } from "react-router-dom";

import BackofficeSidebar from "../component/backOfficeSidebar";

import "../RestaurantBackofficeDashboard.css";
import "./TableManagement.css";
import { QRCodeCanvas } from "qrcode.react";

type TableStatus = "AVAILABLE" | "ACTIVE";

type RestaurantTable = {
    id: number;
    tableNumber: string;
    status: TableStatus;
    sessionId?: number | null;
    qrToken?: string | null;
    openedAt?: string | null;
};

type TableSessionResponse = {
    sessionId: number;
    tableId: number;
    tableNumber: string;
    qrToken: string;
    status: string;
    openedAt: string;
    closedAt?: string | null;
};

type TableOrderItem = {
    id: number;
    menuId: number;
    menuName: string;
    unitPrice: number;
    quantity: number;
    notes: string | null;
    subtotal: number;
    status: "ACTIVE" | "CANCELLED";
};

type TableOrder = {
    orderId: number;
    sessionId: number;
    tableNumber: string;
    status:
    | "NEW"
    | "PREPARING"
    | "SERVED"
    | "CANCELLED";
    subtotal: number;
    createdAt: string;
    items: TableOrderItem[];
};

const API_BASE_URL = "https://okhrestaurant-ca7148d529c4.herokuapp.com";

const TableManagement = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(Date.now());
    const [tables, setTables] =
        React.useState<RestaurantTable[]>([]);

    const [selectedTable, setSelectedTable] =
        React.useState<RestaurantTable | null>(null);
    const [unfinishedTableIds, setUnfinishedTableIds] =
        React.useState<Set<number>>(new Set());

    const [openModal, setOpenModal] = React.useState(false);
    const [detailModal, setDetailModal] = React.useState(false);
    const [closeModal, setCloseModal] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [actionLoading, setActionLoading] = React.useState(false);
    const [tableOrders, setTableOrders] = React.useState<TableOrder[]>([]);

    const [ordersLoading, setOrdersLoading] = React.useState(false);

    const getHeaders = (withJson = false) => {
        const token = localStorage.getItem("token");

        const headers: Record<string, string> = {};

        if (withJson) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        return headers;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/backoffice");
    };

    const getTableAgeMinutes = (openedAt?: string | null) => {
        if (!openedAt) return 0;

        const opened = new Date(openedAt).getTime();

        return Math.floor((currentTime - opened) / 60000);
    };

    const getTableWarning = (
        openedAt?: string | null,
        hasUnfinishedOrders?: boolean
    ) => {
        if (!openedAt || !hasUnfinishedOrders) {
            return null;
        }

        const ageMinutes = getTableAgeMinutes(openedAt);

        if (ageMinutes >= 120) {
            return {
                level: "critical",
                message: "This table has been active for more than 2 hours with unfinished orders."
            };
        }

        if (ageMinutes >= 90) {
            return {
                level: "warning",
                message: "This table has been active for more than 90 minutes with unfinished orders."
            };
        }

        return null;
    };

    const loadTableOrders = async (
        tableId: number,
        showLoading = true,
    ) => {
        try {
            if (showLoading) {
                setOrdersLoading(true);
            }

            const response = await fetch(
                `${API_BASE_URL}/api/tables/${tableId}/orders`,
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
                    "Failed to load table orders.",
                );
            }

            setTableOrders(data);

        } catch (error) {
            console.error(error);

            if (showLoading) {
                alert(
                    error instanceof Error
                        ? error.message
                        : "Failed to load table orders.",
                );
            }

        } finally {
            if (showLoading) {
                setOrdersLoading(false);
            }
        }
    };
    /*
     * =========================
     * GET TABLES
     * =========================
     */

    const fetchTables = async () => {
        try {
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
                throw new Error("Failed to load tables");
            }

            const data: RestaurantTable[] =
                await response.json();

            setTables(data);
        } catch (error) {
            console.error("Failed to fetch tables:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTables();
    }, []);

    React.useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentTime(Date.now());
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, []);

    /*
     * =========================
     * ADD TABLE
     * =========================
     */

    const handleAddTable = async () => {
        const highestTableNumber = tables.reduce(
            (max, table) => {
                const number =
                    Number(table.tableNumber);

                return number > max
                    ? number
                    : max;
            },
            0,
        );

        const nextNumber =
            highestTableNumber + 1;

        const tableNumber =
            String(nextNumber).padStart(2, "0");

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/tables`,
                {
                    method: "POST",

                    headers: getHeaders(true),

                    body: JSON.stringify({
                        tableNumber,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to add table",
                );
            }

            await fetchTables();

        } catch (error) {
            console.error(error);

            alert(
                "Failed to add table.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * =========================
     * OPEN TABLE
     * =========================
     */

    const handleOpenTable = (
        table: RestaurantTable,
    ) => {
        setSelectedTable(table);
        setOpenModal(true);
    };

    const confirmOpenTable = async () => {
        if (!selectedTable) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/tables/${selectedTable.id}/open`,
                {
                    method: "POST",

                    headers: getHeaders(),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to open table",
                );
            }

            const session: TableSessionResponse =
                await response.json();

            const openedTable: RestaurantTable = {
                id: session.tableId,

                tableNumber:
                    session.tableNumber,

                status: "ACTIVE",

                sessionId:
                    session.sessionId,

                qrToken:
                    session.qrToken,

                openedAt:
                    session.openedAt,
            };

            setSelectedTable(openedTable);

            setOpenModal(false);

            await fetchTables();

            setDetailModal(true);

        } catch (error) {
            console.error(error);

            alert(
                "Failed to open table.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * =========================
     * DETAILS
     * =========================
     */

    const handleViewDetails = async (
        table: RestaurantTable,
    ) => {

        setSelectedTable(table);

        setTableOrders([]);

        setDetailModal(true);

        await loadTableOrders(
            table.id,
        );
    };
    React.useEffect(() => {
        if (!detailModal || !selectedTable) {
            return;
        }

        const intervalId = window.setInterval(() => {
            loadTableOrders(
                selectedTable.id,
                false,
            );
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [detailModal, selectedTable?.id]);
    /*
     * =========================
     * CLOSE TABLE
     * =========================
     */

    const handleCloseTable = async () => {
        if (!selectedTable) {
            return;
        }

        await loadTableOrders(
            selectedTable.id,
            false,
        );

        setDetailModal(false);
        setCloseModal(true);
    };

    const confirmCloseTable = async () => {
        if (!selectedTable) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/tables/${selectedTable.id}/close`,
                {
                    method: "POST",

                    headers: getHeaders(),
                },
            );

            if (!response.ok) {
                const data = await response.json();

                throw new Error(
                    data.message || "Failed to close table.",
                );
            }

            setCloseModal(false);
            setSelectedTable(null);

            await fetchTables();

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to close table.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * =========================
     * REMOVE TABLE
     * =========================
     */

    const handleRemoveTable = async (
        table: RestaurantTable,
    ) => {

        if (table.status === "ACTIVE") {
            alert(
                "Active table cannot be removed. Close the table first.",
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to remove Table ${table.tableNumber}?`,
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/tables/${table.id}`,
                {
                    method: "DELETE",

                    headers: getHeaders(),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to remove table",
                );
            }

            await fetchTables();

        } catch (error) {
            console.error(error);

            alert(
                "Failed to remove table.",
            );
        } finally {
            setActionLoading(false);
        }
    };

    /*
     * =========================
     * PRINT QR
     * =========================
     */
    const getOrderUrl = (qrToken?: string | null) => {
        if (!qrToken) {
            return "";
        }

        return `${window.location.origin}/order/q/${qrToken}`;
    };
    const handlePrintQr = () => {
        if (!selectedTable?.qrToken) {
            alert("QR token is not available.");
            return;
        }

        const canvas = document.getElementById(
            "table-session-qr",
        ) as HTMLCanvasElement | null;

        if (!canvas) {
            alert("QR image is not available.");
            return;
        }

        const qrImage = canvas.toDataURL("image/png");

        const orderUrl = getOrderUrl(
            selectedTable.qrToken,
        );

        const printWindow = window.open(
            "",
            "_blank",
            "width=450,height=650",
        );

        if (!printWindow) {
            alert(
                "Unable to open print window. Please allow popups for this website.",
            );
            return;
        }

        printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Table ${selectedTable.tableNumber} QR</title>

        <style>
          @page {
            margin: 8mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 20px;

            font-family: Arial, sans-serif;

            text-align: center;

            color: #111;
            background: #fff;
          }

          .logo {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          .subtitle {
            font-size: 13px;
            margin-bottom: 22px;
          }

          .table {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
          }

          .qr {
            width: 230px;
            height: 230px;

            object-fit: contain;
          }

          .scan {
            margin-top: 15px;

            font-size: 20px;
            font-weight: 700;
          }

          .instruction {
            margin-top: 6px;

            font-size: 13px;
          }

          .session {
            margin-top: 18px;

            font-size: 11px;
            color: #555;
          }

          .url {
            margin-top: 10px;

            font-size: 8px;

            word-break: break-all;

            color: #777;
          }
        </style>
      </head>

      <body>

        <div class="logo">
          Old Klang House
        </div>

        <div class="subtitle">
          Bak Kut Teh
        </div>

        <div class="table">
          TABLE ${selectedTable.tableNumber}
        </div>

        <img
          class="qr"
          src="${qrImage}"
          alt="QR Code"
        />

        <div class="scan">
          Scan to Order
        </div>

        <div class="instruction">
          Scan this QR code using your phone camera
        </div>

        <div class="session">
          Session #${selectedTable.sessionId ?? "-"}
        </div>

        <div class="url">
          ${orderUrl}
        </div>

      </body>
    </html>
  `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    };

    /*
     * =========================
     * FORMAT TIME
     * =========================
     */

    const formatTime = (
        openedAt?: string | null,
    ) => {

        if (!openedAt) {
            return "-";
        }

        return new Date(
            openedAt,
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const availableTables =
        tables.filter(
            (table) =>
                table.status === "AVAILABLE",
        ).length;

    const activeTables =
        tables.filter(
            (table) =>
                table.status === "ACTIVE",
        ).length;

    const unfinishedOrders = tableOrders.filter(
        (order) =>
            order.status === "NEW" ||
            order.status === "PREPARING",
    );

    const tableWarning = getTableWarning(
        selectedTable?.openedAt,
        unfinishedOrders.length > 0,
    );
    return (
        <div className="backofficeLayout">

            <BackofficeSidebar
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <div className="backoffice__container tableManagement">

                <button
                    className="mobileMenuButton"
                    onClick={() =>
                        setSidebarOpen(true)
                    }
                >
                    ☰
                </button>

                {/* HEADER */}

                <div className="tableManagement__header">

                    <div>
                        <h1>
                            Table Management
                        </h1>

                        <p>
                            Manage restaurant tables and customer QR ordering sessions.
                        </p>
                    </div>

                    <button
                        className="tableManagement__button tableManagement__addButton"
                        onClick={handleAddTable}
                        disabled={actionLoading}
                    >
                        + Add Table
                    </button>

                </div>

                {/* SUMMARY */}

                <div className="tableManagement__summary">

                    <div className="tableManagement__summaryCard">

                        <span className="tableManagement__summaryLabel">
                            Total Tables
                        </span>

                        <strong>
                            {tables.length}
                        </strong>

                    </div>

                    <div className="tableManagement__summaryCard">

                        <span className="tableManagement__summaryLabel">
                            Available
                        </span>

                        <strong>
                            {availableTables}
                        </strong>

                    </div>

                    <div className="tableManagement__summaryCard">

                        <span className="tableManagement__summaryLabel">
                            Active
                        </span>

                        <strong>
                            {activeTables}
                        </strong>

                    </div>

                </div>

                {/* LOADING */}

                {loading ? (

                    <div className="tableManagement__loading">
                        Loading tables...
                    </div>

                ) : (

                    <div className="tableManagement__grid">

                        {tables.map((table) => {

                            const isActive =
                                table.status === "ACTIVE";

                            const tableAgeMinutes =
                                getTableAgeMinutes(table.openedAt);

                            const showOver90Warning =
                                isActive && tableAgeMinutes >= 90;

                            const showOver2HoursWarning =
                                isActive && tableAgeMinutes >= 120;

                            return (
                                <div
                                    key={table.id}
                                    className={`tableManagement__card ${isActive
                                        ? "active"
                                        : "available"
                                        }`}
                                >

                                    <div className="tableManagement__cardTop">

                                        <div className="tableManagement__tableIcon">
                                            {table.tableNumber}
                                        </div>

                                        <div className="tableManagement__statusWrapper">

                                            <span
                                                className={`tableManagement__status ${isActive
                                                    ? "active"
                                                    : "available"
                                                    }`}
                                            >
                                                {table.status}
                                            </span>

                                            {showOver90Warning && (
                                                <span
                                                    className={`tableManagement__timeWarning ${showOver2HoursWarning ? "critical" : ""
                                                        }`}
                                                >
                                                    ⚠{" "}
                                                    {showOver2HoursWarning
                                                        ? "OVER 2 HOURS UNFINISHED ORDER"
                                                        : "OVER 90 MIN UNFINISHED ORDER"}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                    <div className="tableManagement__cardBody">

                                        <h2>
                                            Table {table.tableNumber}
                                        </h2>

                                        {isActive ? (
                                            <>
                                                <p>
                                                    Customer session is currently active.
                                                </p>

                                                <div className="tableManagement__sessionInfo">

                                                    <div>
                                                        <span>
                                                            Active Since
                                                        </span>

                                                        <strong>
                                                            {formatTime(
                                                                table.openedAt,
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Session
                                                        </span>

                                                        <strong>
                                                            #{table.sessionId}
                                                        </strong>
                                                    </div>

                                                </div>
                                            </>
                                        ) : (
                                            <p>
                                                This table is available for a new customer.
                                            </p>
                                        )}

                                    </div>

                                    <div className="tableManagement__cardFooter">

                                        {isActive ? (

                                            <button
                                                className="tableManagement__button secondary"
                                                onClick={() =>
                                                    handleViewDetails(
                                                        table,
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>

                                        ) : (
                                            <>
                                                <button
                                                    className="tableManagement__button"
                                                    onClick={() =>
                                                        handleOpenTable(
                                                            table,
                                                        )
                                                    }
                                                >
                                                    Open Table
                                                </button>

                                                <button
                                                    className="tableManagement__button remove"
                                                    onClick={() =>
                                                        handleRemoveTable(
                                                            table,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

                {/* OPEN MODAL */}

                {openModal && selectedTable && (

                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() =>
                            setOpenModal(false)
                        }
                    >

                        <div
                            className="tableManagement__modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="tableManagement__modalHeader">

                                <h2>
                                    Open Table{" "}
                                    {selectedTable.tableNumber}
                                </h2>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() =>
                                        setOpenModal(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <p className="tableManagement__modalDescription">
                                Open this table for a new customer ordering session?
                            </p>

                            <div className="tableManagement__notice">
                                A new unique QR ordering session will be created for this table.
                            </div>

                            <div className="tableManagement__modalActions">

                                <button
                                    className="tableManagement__button light"
                                    onClick={() =>
                                        setOpenModal(false)
                                    }
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="tableManagement__button"
                                    onClick={
                                        confirmOpenTable
                                    }
                                    disabled={actionLoading}
                                >
                                    {actionLoading
                                        ? "Opening..."
                                        : "Open Table"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* DETAIL MODAL */}

                {detailModal && selectedTable && (

                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() =>
                            setDetailModal(false)
                        }
                    >

                        <div
                            className="tableManagement__modal tableManagement__modalDetail"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="tableManagement__modalHeader">

                                <div>

                                    <span className="tableManagement__modalSmallTitle">
                                        ACTIVE TABLE
                                    </span>

                                    <h2>
                                        Table{" "}
                                        {selectedTable.tableNumber}
                                    </h2>

                                </div>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() =>
                                        setDetailModal(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="tableManagement__detailStatus">

                                <span className="tableManagement__status active">
                                    ACTIVE
                                </span>

                                <span>
                                    Since{" "}
                                    {formatTime(
                                        selectedTable.openedAt,
                                    )}
                                </span>

                            </div>
                            {tableWarning && (
                                <div
                                    className={`tableManagement__tableTimeWarning ${tableWarning.level}`}
                                >
                                    <strong>
                                        {tableWarning.level === "critical"
                                            ? "⚠ Table requires attention"
                                            : "⚠ Table has been active for over 90 minutes"}
                                    </strong>

                                    <p>
                                        {tableWarning.message}
                                    </p>

                                    <span>
                                        Unfinished orders:{" "}
                                        <strong>{unfinishedOrders.length}</strong>
                                    </span>
                                </div>
                            )}
                            {/* QR PLACEHOLDER */}

                            <div className="tableManagement__qrContainer">

                                <div className="tableManagement__qrPlaceholder">
                                    {selectedTable.qrToken ? (
                                        <div className="tableManagement__realQr">
                                            <QRCodeCanvas
                                                id="table-session-qr"
                                                value={getOrderUrl(selectedTable.qrToken)}
                                                size={200}
                                                level="M"
                                                includeMargin={true}
                                            />
                                        </div>
                                    ) : (
                                        <div className="tableManagement__qrUnavailable">
                                            QR not available
                                        </div>
                                    )}
                                </div>

                                <h3>
                                    Scan to Order
                                </h3>

                                <p>
                                    This QR is unique for the current table session.
                                </p>

                            </div>

                            <div className="tableManagement__sessionDetail">

                                <span>
                                    Session
                                </span>

                                <strong>
                                    #{selectedTable.sessionId}
                                </strong>

                            </div>
                            <div className="tableManagement__ordersSection">

                                <div className="tableManagement__ordersHeader">

                                    <h3>
                                        Orders
                                    </h3>

                                    <span>
                                        {tableOrders.length} order
                                        {tableOrders.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>

                                </div>

                                {ordersLoading ? (

                                    <div className="tableManagement__ordersLoading">
                                        Loading orders...
                                    </div>

                                ) : tableOrders.length === 0 ? (

                                    <div className="tableManagement__ordersEmpty">
                                        No orders have been placed yet.
                                    </div>

                                ) : (

                                    <div className="tableManagement__ordersList">

                                        {tableOrders.map(
                                            (order) => (

                                                <div
                                                    key={order.orderId}
                                                    className="tableManagement__orderCard"
                                                >

                                                    <div className="tableManagement__orderCardHeader">

                                                        <div>

                                                            <span>
                                                                ORDER #{order.orderId}
                                                            </span>

                                                        </div>

                                                        <span
                                                            className={`tableManagement__orderStatus ${order.status.toLowerCase()}`}
                                                        >
                                                            {order.status}
                                                        </span>

                                                    </div>

                                                    <div className="tableManagement__orderItems">

                                                        {order.items.map(
                                                            (item) => (

                                                                <div
                                                                    key={item.id}
                                                                    className={`tableManagement__orderItem ${item.status === "CANCELLED"
                                                                        ? "cancelled"
                                                                        : ""
                                                                        }`}
                                                                >
                                                                    <div>

                                                                        <div className="tableManagement__orderItemMain">

                                                                            <strong>
                                                                                {item.quantity}×{" "}
                                                                                {item.menuName}
                                                                            </strong>

                                                                            {item.status === "CANCELLED" && (
                                                                                <span className="tableManagement__orderItemStatus cancelled">
                                                                                    CANCELLED
                                                                                </span>
                                                                            )}

                                                                        </div>

                                                                        {item.notes && (
                                                                            <small>
                                                                                Note:{" "}
                                                                                {item.notes}
                                                                            </small>
                                                                        )}

                                                                    </div>

                                                                    <span
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
                                                                    </span>

                                                                </div>

                                                            ),
                                                        )}

                                                    </div>

                                                    <div className="tableManagement__orderTotal">

                                                        <span>
                                                            Total
                                                        </span>

                                                        <strong>
                                                            Rp{" "}
                                                            {new Intl.NumberFormat(
                                                                "id-ID",
                                                            ).format(
                                                                order.subtotal,
                                                            )}
                                                        </strong>

                                                    </div>

                                                </div>

                                            ),
                                        )}

                                    </div>

                                )}

                            </div>

                            <div className="tableManagement__detailActions">

                                <button
                                    className="tableManagement__button"
                                    onClick={handlePrintQr}
                                >
                                    Print QR
                                </button>

                                <button
                                    className="tableManagement__button danger"
                                    onClick={
                                        handleCloseTable
                                    }
                                >
                                    Close Table
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* CLOSE MODAL */}

                {closeModal && selectedTable && (

                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() =>
                            setCloseModal(false)
                        }
                    >

                        <div
                            className="tableManagement__modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="tableManagement__modalHeader">

                                <h2>
                                    Close Table{" "}
                                    {selectedTable.tableNumber}?
                                </h2>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() =>
                                        setCloseModal(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <p className="tableManagement__modalDescription">
                                Make sure payment has already been completed in Moka before closing this table.
                            </p>

                            {unfinishedOrders.length > 0 ? (
                                <div className="tableManagement__warning">
                                    This table cannot be closed because it still has{" "}
                                    <strong>
                                        {unfinishedOrders.length} unfinished order
                                        {unfinishedOrders.length !== 1 ? "s" : ""}
                                    </strong>
                                    .
                                    <br />
                                    Please make sure all orders are SERVED or CANCELLED first.
                                </div>
                            ) : (
                                <div className="tableManagement__warning">
                                    Closing this table will invalidate the current QR ordering session.
                                </div>
                            )}

                            <div className="tableManagement__modalActions">

                                <button
                                    className="tableManagement__button light"
                                    onClick={() =>
                                        setCloseModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="tableManagement__button danger"
                                    onClick={confirmCloseTable}
                                    disabled={
                                        actionLoading ||
                                        unfinishedOrders.length > 0
                                    }
                                >
                                    {actionLoading
                                        ? "Closing..."
                                        : unfinishedOrders.length > 0
                                            ? "Finish Orders First"
                                            : "Close Table"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default TableManagement;