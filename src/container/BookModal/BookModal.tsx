import React from "react";
import "../BookModal/BookModal.css";

type BookingModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const BookingModal: React.FC<BookingModalProps> = ({ open, setOpen }) => {
  if (!open) return null;

  return (
    <div className="modal__overlay" onClick={() => setOpen(false)}>
      <div
        className="modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={() => setOpen(false)}>
          ×
        </button>

        <h2 className="modal__title">Book A Table</h2>

        <input placeholder="Full Name" />
        <input type="date" />
        <input type="time" />
        <input placeholder="Number of Guests" />
        <input placeholder="Phone Number" />
        <textarea placeholder="Special request (optional)" />

        <button className="modal__submit">Book Now</button>
      </div>
    </div>
  );
};

export default BookingModal;