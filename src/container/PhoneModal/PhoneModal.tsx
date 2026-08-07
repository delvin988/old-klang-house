import React from "react";
import "../BookModal/BookModal.css";

type Props = {
  language: "en" | "id";
  phone: string;
  setPhone: (v: string) => void;
  setVerifiedPhone: (v: string) => void;
  onSuccess: () => void;
  onClose: () => void;
};

const PhoneModal: React.FC<Props> = ({
  language,
  phone,
  setPhone,
  setVerifiedPhone,
  onSuccess,
  onClose,
}) => {
  const [loading, setLoading] = React.useState(false);
  const translations = {
    en: {
      title: "Book a Table",
      placeholder: "Enter your WhatsApp number to verification code.",
      sendOtp: "Send Code",
      sending: "Sending...",
      invalidPhone: "Invalid phone number",
      enterPhone: "Please enter phone number",
      otpSent: "Verification code sent to your WhatsApp",
      failed: "Failed to send verification code",
    },

    id: {
      title: "Reservasi Meja",
      placeholder:
        "Masukkan nomor WhatsApp untuk kode verifikasi.",
      sendOtp: "Kirim Kode",
      sending: "Mengirim...",
      invalidPhone: "Nomor telepon tidak valid",
      enterPhone: "Silakan masukkan nomor telepon",
      otpSent: "Kode verifikasi telah dikirim ke WhatsApp Anda",
      failed: "Gagal mengirim kode verifikasi",
    },
  };

  const t = translations[language];
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      alert(t.invalidPhone);
      return;
    }
    if (!phone) {
      alert(t.enterPhone);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://okhrestaurant-ca7148d529c4.herokuapp.com/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t.failed);
      }

      alert(t.otpSent);

      setVerifiedPhone(phone);
      setPhone("");

      onSuccess();
    } catch (err: any) {
      console.error(err);

      alert(err.message || t.failed);
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          className="modal__submit"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? t.sending : t.sendOtp}
        </button>
      </div>
    </div>
  );
};

export default PhoneModal;
