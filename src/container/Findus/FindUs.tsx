import React from "react";
import { motion, useInView } from "framer-motion";

import { SubHeading } from "../../components";
import { images } from "../../constants";

const easeSmooth = [0.65, 0, 0.35, 1] as const;
const translations = {
  en: {
    subtitle: "Contact",
    title: "Find Us",
    openingHours: "Opening Hours",
    weekdayHours: "Mon - Fri: 10:00 am - 02:00 am",
    weekendHours: "Sat - Sun: 10:00 am - 03:00 am",
    button: "Get Directions",
  },

  id: {
    subtitle: "Kontak",
    title: "Lokasi Kami",
    openingHours: "Jam Operasional",
    weekdayHours: "Sen - Jum: 10:00 - 02:00",
    weekendHours: "Sab - Min: 10:00 - 03:00",
    button: "Lihat Lokasi",
  },
};
type Props = {
  language: "en" | "id";
};

const FindUs: React.FC<Props> = ({ language }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = translations[language];
  return (
    <div
      ref={ref}
      className="app__findus app__bg app__wrapper section__padding"
      id="contact"
    >
      <motion.div
        className="app__wrapper_info"
        initial={{ opacity: 0, x: -48 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth }}
      >
        <SubHeading title={t.subtitle} />
        <h1 className="headtext__cormorant" style={{ marginBottom: "3rem" }}>
          {t.title}
        </h1>
        <div className="app__wrapper-content">
          <p className="p__opensans">
            Jl. Sudirman No. 45, Jakarta Pusat, DKI Jakarta 10220
          </p>{" "}
          <p
            className="p__cormorant"
            style={{ color: "#A63A1F", margin: "2rem 0" }}
          >
            {t.openingHours}
          </p>
          <p className="p__opensans">{t.weekdayHours}</p>
          <p className="p__opensans">{t.weekdayHours}</p>
        </div>
        <button
          type="button"
          className="custom__button"
          style={{ marginTop: "2rem" }}
        >
          {t.button}
        </button>
      </motion.div>

      <motion.div
        className="app__wrapper_img"
        initial={{ opacity: 0, x: 48 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth, delay: 0.12 }}
      >
        <img src={images.findus} alt="finus_img" />
      </motion.div>
    </div>
  );
};

export default FindUs;
