import React from "react";
import "../BookModal/BookModal.css";

type Props = {
  phone: string;
  setPhone: (v: string) => void;
  setVerifiedPhone: (v: string) => void;
  onSuccess: () => void;
  onClose: () => void;
};

const PhoneModal: React.FC<Props> = ({
  phone,
  setPhone,
  setVerifiedPhone,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert("Invalid Indonesian phone number");
      return;
    }
    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      alert(`OTP: ${data.otp}`);
      setVerifiedPhone(phone); // simpan ke next step
      setPhone("");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal__title">Login with Phone</h2>

        <input
          placeholder="Phone Number (Indonesia Number)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          className="modal__submit"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default PhoneModal;
