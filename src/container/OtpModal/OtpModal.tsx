import React from "react";
import "../BookModal/BookModal.css";

type Props = {
  language: "en" | "id";
  phone: string;
  onSuccess: () => void;
  onClose: () => void;
};

const OtpModal: React.FC<Props> = ({ language, phone, onSuccess, onClose }) => {
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const translations = {
    en: {
      title: "Enter Verification Code",
      description: "Please enter the verification code sent to your WhatsApp.",
      placeholder: "6-digit verification code",
      verify: "Verify Code",
      verifying: "Verifying...",
      enterOtp: "Please enter verification code",
      success: "Verification successful",
      incorrect: "Incorrect verification code",
      failed: "Verification failed",
    },

    id: {
      title: "Masukkan Kode Verifikasi",
      description:
        "Masukkan kode verifikasi yang telah dikirim ke WhatsApp Anda.",
      placeholder: "Kode verifikasi 6 digit",
      verify: "Verifikasi Kode",
      verifying: "Memverifikasi...",
      enterOtp: "Silakan masukkan kode verifikasi",
      success: "Verifikasi berhasil",
      incorrect: "Kode verifikasi salah",
      failed: "Verifikasi gagal",
    },
  };

  const t = translations[language];
  const handleVerify = async () => {
    if (!otp) {
      alert(t.enterOtp);
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
        onSuccess();
      } else {
        alert(t.incorrect);
      }
    } catch (err) {
      console.error(err);
      alert(t.failed);
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

        <h2 className="modal__title">{t.title}</h2>
        <input
          placeholder={t.placeholder}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="modal__submit"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? t.verifying : t.verify}
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
