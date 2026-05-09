import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/6282116824234"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsappButton"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;