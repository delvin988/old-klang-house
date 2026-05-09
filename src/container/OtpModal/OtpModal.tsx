import React from "react";
import "../BookModal/BookModal.css";

type Props = {
  phone: string;
  onSuccess: () => void;
  onClose: () => void;
};

const OtpModal: React.FC<Props> = ({ phone, onSuccess, onClose }) => {
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (data.verified) {
        alert("Login success");
        onSuccess();
      } else {
        alert("OTP incorrect");
      }
    } catch (err) {
      console.error(err);
      alert("Verify failed");
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

        <h2 className="modal__title">Enter OTP</h2>

        <input
          placeholder="6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="modal__submit"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpModal;