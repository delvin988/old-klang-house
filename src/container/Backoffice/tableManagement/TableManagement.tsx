import React from "react";
import { useNavigate } from "react-router-dom";

import BackofficeSidebar from "../component/backOfficeSidebar";

import "../RestaurantBackofficeDashboard.css";
import "./TableManagement.css";

type TableStatus = "AVAILABLE" | "ACTIVE";

type RestaurantTable = {
    id: number;
    tableNumber: string;
    status: TableStatus;
    activeSince?: string;
    sessionCode?: string;
};

const initialTables: RestaurantTable[] = [
    {
        id: 1,
        tableNumber: "01",
        status: "AVAILABLE",
    },
    {
        id: 2,
        tableNumber: "02",
        status: "ACTIVE",
        activeSince: "19:30",
        sessionCode: "TEMP-002",
    },
    {
        id: 3,
        tableNumber: "03",
        status: "AVAILABLE",
    },
    {
        id: 4,
        tableNumber: "04",
        status: "ACTIVE",
        activeSince: "20:10",
        sessionCode: "TEMP-004",
    },
    {
        id: 5,
        tableNumber: "05",
        status: "AVAILABLE",
    },
    {
        id: 6,
        tableNumber: "06",
        status: "AVAILABLE",
    },
    {
        id: 7,
        tableNumber: "07",
        status: "AVAILABLE",
    },
    {
        id: 8,
        tableNumber: "08",
        status: "AVAILABLE",
    },
];

const TableManagement = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const [tables, setTables] =
        React.useState<RestaurantTable[]>(initialTables);

    const [selectedTable, setSelectedTable] =
        React.useState<RestaurantTable | null>(null);

    const [openModal, setOpenModal] = React.useState(false);
    const [detailModal, setDetailModal] = React.useState(false);
    const [closeModal, setCloseModal] = React.useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/backoffice");
    };
    const handleAddTable = () => {
        const highestTableNumber = tables.reduce((max, table) => {
            const number = Number(table.tableNumber);
            return number > max ? number : max;
        }, 0);

        const nextNumber = highestTableNumber + 1;

        const newTable: RestaurantTable = {
            id: Date.now(),
            tableNumber: String(nextNumber).padStart(2, "0"),
            status: "AVAILABLE",
        };

        setTables((prev) => [...prev, newTable]);
    };
    const handleRemoveTable = (table: RestaurantTable) => {
        if (table.status === "ACTIVE") {
            alert("Active table cannot be removed. Close the table first.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to remove Table ${table.tableNumber}?`,
        );

        if (!confirmed) {
            return;
        }

        setTables((prev) =>
            prev.filter((item) => item.id !== table.id),
        );
    };

    const handleOpenTable = (table: RestaurantTable) => {
        setSelectedTable(table);
        setOpenModal(true);
    };

    const confirmOpenTable = () => {
        if (!selectedTable) {
            return;
        }

        const now = new Date();

        const time = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const sessionCode = `TEMP-${String(selectedTable.id).padStart(3, "0")}`;

        const updatedTable: RestaurantTable = {
            ...selectedTable,
            status: "ACTIVE",
            activeSince: time,
            sessionCode,
        };

        setTables((prev) =>
            prev.map((table) =>
                table.id === selectedTable.id ? updatedTable : table,
            ),
        );

        setSelectedTable(updatedTable);

        setOpenModal(false);
        setDetailModal(true);
    };

    const handleViewDetails = (table: RestaurantTable) => {
        setSelectedTable(table);
        setDetailModal(true);
    };

    const handleCloseTable = () => {
        setDetailModal(false);
        setCloseModal(true);
    };

    const confirmCloseTable = () => {
        if (!selectedTable) {
            return;
        }

        setTables((prev) =>
            prev.map((table) =>
                table.id === selectedTable.id
                    ? {
                        ...table,
                        status: "AVAILABLE",
                        activeSince: undefined,
                        sessionCode: undefined,
                    }
                    : table,
            ),
        );

        setCloseModal(false);
        setSelectedTable(null);
    };

    const handlePrintQr = () => {
        alert(
            "QR printing will be connected after the backend session and real QR generation are implemented.",
        );
    };

    const availableTables = tables.filter(
        (table) => table.status === "AVAILABLE",
    ).length;

    const activeTables = tables.filter(
        (table) => table.status === "ACTIVE",
    ).length;

    return (
        <div className="backofficeLayout">
            <BackofficeSidebar
                onLogout={handleLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="backoffice__container tableManagement">
                <button
                    className="mobileMenuButton"
                    onClick={() => setSidebarOpen(true)}
                >
                    ☰
                </button>

                {/* HEADER */}

                <div className="tableManagement__header">
                    <div>
                        <h1>Table Management</h1>

                        <p>
                            Manage restaurant tables and customer QR ordering sessions.
                        </p>
                        <button
                            className="tableManagement__button tableManagement__addButton"
                            onClick={handleAddTable}
                        >
                            + Add Table
                        </button>
                    </div>
                </div>

                {/* SUMMARY */}

                <div className="tableManagement__summary">
                    <div className="tableManagement__summaryCard">
                        <span className="tableManagement__summaryLabel">
                            Total Tables
                        </span>

                        <strong>{tables.length}</strong>
                    </div>

                    <div className="tableManagement__summaryCard">
                        <span className="tableManagement__summaryLabel">
                            Available
                        </span>

                        <strong>{availableTables}</strong>
                    </div>

                    <div className="tableManagement__summaryCard">
                        <span className="tableManagement__summaryLabel">
                            Active
                        </span>

                        <strong>{activeTables}</strong>
                    </div>
                </div>

                {/* TABLE GRID */}

                <div className="tableManagement__grid">
                    {tables.map((table) => {
                        const isActive = table.status === "ACTIVE";

                        return (
                            <div
                                key={table.id}
                                className={`tableManagement__card ${isActive ? "active" : "available"
                                    }`}
                            >
                                <div className="tableManagement__cardTop">
                                    <div className="tableManagement__tableIcon">
                                        {table.tableNumber}
                                    </div>

                                    <span
                                        className={`tableManagement__status ${isActive ? "active" : "available"
                                            }`}
                                    >
                                        {table.status}
                                    </span>
                                </div>

                                <div className="tableManagement__cardBody">
                                    <h2>Table {table.tableNumber}</h2>

                                    {isActive ? (
                                        <>
                                            <p>
                                                Customer session is currently active.
                                            </p>

                                            <div className="tableManagement__sessionInfo">
                                                <div>
                                                    <span>Active Since</span>

                                                    <strong>{table.activeSince}</strong>
                                                </div>

                                                <div>
                                                    <span>Session</span>

                                                    <strong>{table.sessionCode}</strong>
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
                                            onClick={() => handleViewDetails(table)}
                                        >
                                            View Details
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="tableManagement__button"
                                                onClick={() => handleOpenTable(table)}
                                            >
                                                Open Table
                                            </button>

                                            <button
                                                className="tableManagement__button remove"
                                                onClick={() => handleRemoveTable(table)}
                                            >
                                                Remove Table
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* OPEN TABLE CONFIRMATION */}

                {openModal && selectedTable && (
                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() => setOpenModal(false)}
                    >
                        <div
                            className="tableManagement__modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="tableManagement__modalHeader">
                                <h2>
                                    Open Table {selectedTable.tableNumber}
                                </h2>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() => setOpenModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <p className="tableManagement__modalDescription">
                                Open this table for a new customer ordering session?
                            </p>

                            <div className="tableManagement__notice">
                                A new QR ordering session will be created for this
                                table.
                            </div>

                            <div className="tableManagement__modalActions">
                                <button
                                    className="tableManagement__button light"
                                    onClick={() => setOpenModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="tableManagement__button"
                                    onClick={confirmOpenTable}
                                >
                                    Open Table
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLE DETAIL */}

                {detailModal && selectedTable && (
                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() => setDetailModal(false)}
                    >
                        <div
                            className="tableManagement__modal tableManagement__modalDetail"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="tableManagement__modalHeader">
                                <div>
                                    <span className="tableManagement__modalSmallTitle">
                                        ACTIVE TABLE
                                    </span>

                                    <h2>
                                        Table {selectedTable.tableNumber}
                                    </h2>
                                </div>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() => setDetailModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="tableManagement__detailStatus">
                                <span className="tableManagement__status active">
                                    ACTIVE
                                </span>

                                <span>
                                    Since {selectedTable.activeSince}
                                </span>
                            </div>

                            {/* QR PLACEHOLDER */}

                            <div className="tableManagement__qrContainer">
                                <div className="tableManagement__qrPlaceholder">
                                    <div className="tableManagement__qrFake">
                                        <span>QR</span>
                                    </div>
                                </div>

                                <h3>Scan to Order</h3>

                                <p>
                                    This QR will be unique for the current table
                                    session.
                                </p>
                            </div>

                            <div className="tableManagement__sessionDetail">
                                <span>Session</span>

                                <strong>{selectedTable.sessionCode}</strong>
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
                                    onClick={handleCloseTable}
                                >
                                    Close Table
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CLOSE TABLE CONFIRMATION */}

                {closeModal && selectedTable && (
                    <div
                        className="tableManagement__modalOverlay"
                        onClick={() => setCloseModal(false)}
                    >
                        <div
                            className="tableManagement__modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="tableManagement__modalHeader">
                                <h2>
                                    Close Table {selectedTable.tableNumber}?
                                </h2>

                                <button
                                    className="tableManagement__closeIcon"
                                    onClick={() => setCloseModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <p className="tableManagement__modalDescription">
                                Make sure payment has already been completed in Moka
                                before closing this table.
                            </p>

                            <div className="tableManagement__warning">
                                Closing the table will end the current customer
                                ordering session.
                            </div>

                            <div className="tableManagement__modalActions">
                                <button
                                    className="tableManagement__button light"
                                    onClick={() => setCloseModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="tableManagement__button danger"
                                    onClick={confirmCloseTable}
                                >
                                    Close Table
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