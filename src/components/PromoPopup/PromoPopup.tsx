import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./PromoPopup.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const translations = {
  en: {
    title: "Check-In Promo",
    comingSoon: "Coming Soon!",
    description:
      "We're preparing something special for you. Stay tuned!",
    button: "Close",
  },

  id: {
    title: "Promo Check-In",
    comingSoon: "Segera Hadir!",
    description:
      "Kami sedang menyiapkan sesuatu yang spesial untuk Anda. Nantikan!",
    button: "Tutup",
  },
};

type Props = {
  language: "en" | "id";
};

const PromoPopup: React.FC<Props> = ({ language }) => {
  const [showPromo, setShowPromo] = React.useState(true);

  const t = translations[language];

  return (
    <AnimatePresence>
      {showPromo && (
        <motion.div
          className="promo__popup"
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          transition={{
            duration: 0.55,
            ease: easeSmooth,
          }}
        >
          {/* <button
            type="button"
            className="promo__popup-close"
            onClick={() => setShowPromo(false)}
            aria-label="Close promotion"
          >
            ×
          </button> */}

          <div className="promo__popup-icon">
            <span>✓</span>
          </div>

          <h2 className="promo__popup-title">
            {t.title}
          </h2>

          <h3 className="promo__popup-coming">
            {t.comingSoon}
          </h3>

          <div className="promo__popup-divider">
            <span />
            <div>◆</div>
            <span />
          </div>

          <p className="promo__popup-description">
            {t.description}
          </p>

          <button
            type="button"
            className="promo__popup-button"
            onClick={() => setShowPromo(false)}
          >
            {t.button}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;