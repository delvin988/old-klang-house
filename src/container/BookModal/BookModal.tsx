import React from "react";
import "../BookModal/BookModal.css";
import MenuModal from "../MenuModal/MenuModal";

type BookingModalProps = {
  language: "en" | "id";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
  phone: string;
};

const BookingModal: React.FC<BookingModalProps> = ({
  language,
  open,
  setOpen,
  phone,
}) => {
  const [showMenuModal, setShowMenuModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [wantMenu, setWantMenu] = React.useState("");
  const today = new Date().toLocaleDateString("en-CA");
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const maxDateString = maxDate.toISOString().split("T")[0];
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
  const translations = {
    en: {
      title: "Book A Table",
      fullName: "Full Name",
      selectTime: "Select Time",
      guests: "Number of Guests",
      email: "Email",
      selectMenu: "Select Menu",
      yes: "Yes",
      no: "No",
      editMenu: "Edit Selected Menu",
      specialRequest: "Special request (optional)",
      loading: "Loading...",
      bookNow: "Book Now",

      requiredFields: "Please fill required fields",
      selectMenuOption: "Please select menu option",
      invalidEmail: "Invalid email format",
      bookingFailed: "Failed to create booking",

      bookingSuccess: "Booking Successful",
      bookingSuccessMessage: "Your reservation has been received.",
      bookingSuccessMessage2:
        "Our team will contact you soon for confirmation.",
      done: "Done",
    },

    id: {
      title: "Reservasi Meja",
      fullName: "Nama Lengkap",
      selectTime: "Pilih Waktu",
      guests: "Jumlah Tamu",
      email: "Email",
      selectMenu: "Pilih Menu",
      yes: "Ya",
      no: "Tidak",
      editMenu: "Ubah Menu Pilihan",
      specialRequest: "Permintaan khusus (opsional)",
      loading: "Memuat...",
      bookNow: "Reservasi Sekarang",

      requiredFields: "Mohon lengkapi data yang wajib diisi",
      selectMenuOption: "Silakan pilih opsi menu",
      invalidEmail: "Format email tidak valid",
      bookingFailed: "Gagal membuat reservasi",

      bookingSuccess: "Reservasi Berhasil",
      bookingSuccessMessage: "Reservasi Anda telah kami terima.",
      bookingSuccessMessage2:
        "Tim kami akan segera menghubungi Anda untuk konfirmasi.",
      done: "Selesai",
    },
  };

  const t = translations[language];
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
      alert(t.requiredFields);
      return;
    }

    if (!wantMenu) {
      alert(t.selectMenuOption);
      return;
    }

    if (!emailRegex.test(form.email) && form.email) {
      alert(t.invalidEmail);
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

      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setShowSuccess(true);

      //   setOpen(false);
    } catch (error) {
      console.error(error);
      alert(t.bookingFailed);
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
        <h2 className="modal__title">{t.title}</h2>
        <input
          name="customerName"
          placeholder={t.fullName}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          min={today}
          max={maxDateString}
          onChange={handleChange}
        />{" "}
        <select name="time" onChange={handleChange} defaultValue="">
          <option value="" disabled hidden>
            {t.selectTime}
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
          placeholder={t.guests}
          onChange={handleChange}
        />
        <input name="phone" value={form.phone} readOnly />
        <input
          name="email"
          type="email"
          placeholder={t.email}
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
            {t.selectMenu}
          </option>
          <option value="yes">{t.yes}</option>
          <option value="no">{t.no}</option>
        </select>
        {wantMenu === "yes" && (
          <button
            type="button"
            className="menuEditButton"
            onClick={() => setShowMenuModal(true)}
          >
            {t.editMenu}
          </button>
        )}
        <textarea
          name="specialRequest"
          placeholder={t.specialRequest}
          onChange={handleChange}
        />
        <button
          className="modal__submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t.loading : t.bookNow}
        </button>
      </div>
      <MenuModal
        open={showMenuModal}
        setOpen={setShowMenuModal}
        language={language}
        setWantMenu={setWantMenu}
        setSelectedMenus={setSelectedMenus}
      />
      {showSuccess && (
        <div className="successModal__overlay">
          <div className="successModal">
            <div className="successModal__icon">✓</div>

            <h2> {t.bookingSuccess}</h2>

            <p>
              {t.bookingSuccessMessage}
              <br />
              {t.bookingSuccessMessage2}
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                setOpen(false);
              }}
            >
              {t.done}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;
