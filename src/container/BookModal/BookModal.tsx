    import React from "react";
    import "../BookModal/BookModal.css";
    import MenuModal from "../MenuModal/MenuModal";

    type BookingModalProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
    phone: string;
    };

    const BookingModal: React.FC<BookingModalProps> = ({
    open,
    setOpen,
    phone,
    }) => {
    const [showMenuModal, setShowMenuModal] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [wantMenu, setWantMenu] = React.useState("");
    const today = new Date().toLocaleDateString("en-CA");
    const [form, setForm] = React.useState({
        customerName: "",
        date: today,
        time: "",
        numberOfPeople: "",
        phone: phone,
        email: "",
        specialRequest: "",
    });
    const [selectedMenus, setSelectedMenus] = React.useState<
        {
        menuId: number;
        menuName: string;
        qty: number;
        }[]
    >([]);

    const [loading, setLoading] = React.useState(false);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
        !form.customerName ||
        !form.date ||
        !form.time ||
        !form.phone ||
        !form.numberOfPeople
        ) {
        alert("Please fill required fields");
        return;
        }

        if (!wantMenu) {
        alert("Please select menu option");
        return;
        }

        if (!emailRegex.test(form.email) && form.email) {
        alert("Invalid email format");
        return;
        }

        try {
        setLoading(true);
        const bookingTime = `${form.date}T${form.time}:00`;

        const payload = {
            customerName: form.customerName,
            phone: form.phone,
            email: form.email,
            bookingTime,
            numberOfPeople: Number(form.numberOfPeople),
            specialRequest: form.specialRequest,
            wantMenu: wantMenu === "yes",
            selectedMenus:
            wantMenu === "yes"
                ? selectedMenus
                    .map((menu) => `${menu.menuId}|${menu.menuName}|${menu.qty}`)
                    .join(";")
                : "",
        };

        const res = await fetch(
            "https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            },
        );

        const data = await res.json();

        setShowSuccess(true);

        //   setOpen(false);
        } catch (error) {
        console.error(error);
        alert("Failed to create booking");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="modal__overlay" onClick={() => setOpen(false)}>
        <div className="modal__container" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setOpen(false)}>
            ×
            </button>
            <h2 className="modal__title">Book A Table</h2>
            <input
            name="customerName"
            placeholder="Full Name"
            onChange={handleChange}
            />
            <input
            name="date"
            type="date"
            value={form.date}
            min={today}
            onChange={handleChange}
            />{" "}
            <select name="time" onChange={handleChange} defaultValue="">
            <option value="" disabled hidden>
                Select Time
            </option>

            {(() => {
                const now = new Date();

                const isToday = form.date === today;

                let startHour = 10;
                let startMinute = 0;

                if (isToday) {
                const next = new Date(now.getTime() + 60 * 60 * 1000); // +1 jam

                startHour = Math.max(10, next.getHours());
                startMinute = next.getMinutes() < 30 ? 0 : 30;
                }

                const slots = [];

                for (let h = startHour; h <= 20; h++) {
                for (let m of [0, 30]) {
                    if (h === startHour && m < startMinute) continue;
                    if (h === 20 && m > 0) continue;

                    const time = `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;

                    slots.push(time);
                }
                }
                if (slots.length === 0) {
                return <option disabled>No available time</option>;
                }

                return slots.map((time) => (
                <option key={time} value={time}>
                    {time}
                </option>
                ));
            })()}
            </select>
            <input
            name="numberOfPeople"
            placeholder="Number of Guests"
            onChange={handleChange}
            />
            <input name="phone" value={form.phone} readOnly />
            <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            />
            <select
            value={wantMenu}
            onChange={(e) => {
                const value = e.target.value;
                setWantMenu(e.target.value);

                if (e.target.value === "yes") {
                setShowMenuModal(true);
                }
                if (value === "no") {
                setSelectedMenus([]);
                }
            }}
            >
            <option value="" disabled hidden>
                Select Menu
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            </select>
            {wantMenu === "yes" && (
            <button
                type="button"
                className="menuEditButton"
                onClick={() => setShowMenuModal(true)}
            >
                Edit Selected Menu
            </button>
            )}
            <textarea
            name="specialRequest"
            placeholder="Special request (optional)"
            onChange={handleChange}
            />
            <button
            className="modal__submit"
            onClick={handleSubmit}
            disabled={loading}
            >
            {loading ? "Loading..." : "Book Now"}
            </button>
        </div>
        <MenuModal
            open={showMenuModal}
            setOpen={setShowMenuModal}
            setWantMenu={setWantMenu}
            setSelectedMenus={setSelectedMenus}
        />
        {showSuccess && (
            <div className="successModal__overlay">
            <div className="successModal">
                <div className="successModal__icon">✓</div>

                <h2>Booking Successful</h2>

                <p>
                Your reservation has been received.
                <br />
                Our team will contact you soon for confirmation.
                </p>

                <button
                onClick={() => {
                    setShowSuccess(false);
                    setOpen(false);
                }}
                >
                Done
                </button>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default BookingModal;
