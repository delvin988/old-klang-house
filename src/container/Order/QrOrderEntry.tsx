import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./QrOrderEntry.css";

type QrSession = {
    tableNumber: string;
    status: string;
    openedAt: string;
};

const API_BASE_URL = "https://okhrestaurant-ca7148d529c4.herokuapp.com";

const QrOrderEntry = () => {
    const { qrToken } = useParams();
    const navigate = useNavigate();

    const [session, setSession] =
        React.useState<QrSession | null>(null);

    const [loading, setLoading] =
        React.useState(true);

    const [error, setError] =
        React.useState(false);

    React.useEffect(() => {
        const validateSession = async () => {

            if (!qrToken) {
                setError(true);
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/tables/session/${qrToken}`,
                );

                if (!response.ok) {
                    setError(true);
                    return;
                }

                const data =
                    await response.json();

                setSession(data);

            } catch (error) {

                console.error(error);

                setError(true);

            } finally {

                setLoading(false);

            }
        };

        validateSession();

    }, [qrToken]);

    if (loading) {
        return (
            <div className="qrOrderPage">
                <div className="qrOrderCard">
                    <p>Checking table session...</p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="qrOrderPage">
                <div className="qrOrderCard">

                    <h1>QR Expired</h1>

                    <p>
                        This ordering session is no longer available.
                    </p>

                    <p>
                        Please contact our staff.
                    </p>

                </div>
            </div>
        );
    }

    return (
        <div className="qrOrderPage">

            <div className="qrOrderCard">

                <div className="qrOrderBrand">
                    Old Klang House
                </div>

                <div className="qrOrderSubtitle">
                    Bak Kut Teh
                </div>

                <div className="qrOrderTable">
                    Table {session.tableNumber}
                </div>

                <span className="qrOrderStatus">
                    ACTIVE
                </span>

                <h1>
                    Welcome
                </h1>

                <p>
                    Your table session is active.
                    You can start ordering.
                </p>

                <button
                    onClick={() =>
                        navigate(`/order/q/${qrToken}/menu`)
                    }
                >
                    View Menu
                </button>

            </div>

        </div>
    );
};

export default QrOrderEntry;