import React from "react";
import { motion, useInView } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram, FiX } from "react-icons/fi";
import { FaTwitter } from "react-icons/fa";

import { FooterOverlay, Newsletter } from "../../components";
import { images } from "../../constants";
import "./Footer.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;
const translations = {
  en: {
    contactUs: "Contact Us",

    quote:
      "The best way to find yourself is to lose yourself in the service of others.",

    workingHours: "Working Hours",

    mondayFriday: "Monday-Friday:",

    saturdaySunday: "Saturday-Sunday:",

    copyright: "Restaurant Old Klang House. All Rights reserved.",
  },

  id: {
    contactUs: "Hubungi Kami",

    quote:
      "Cara terbaik untuk menemukan diri Anda adalah dengan mengabdikan diri dalam melayani orang lain.",

    workingHours: "Jam Operasional",

    mondayFriday: "Senin-Jumat:",

    saturdaySunday: "Sabtu-Minggu:",

    copyright: "Restaurant Old Klang House. Hak cipta dilindungi.",
  },
};
type Props = {
  language: "en" | "id";
};

const Footer: React.FC<Props> = ({ language }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const t = translations[language];
  return (
    <div ref={ref} className="app__footer app__bg section__padding" id="login">
      {/* <FooterOverlay /> */}
      {/* <Newsletter /> */}

      <div className="app__footer-links">
        <motion.div
          className="app__footer-links_contact"
          initial={{ opacity: 0, x: -56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <h1 className="app__footer-headtext">{t.contactUs}</h1>
          <p className="p__opensans">WA : +62 85218281537</p>
          <p className="p__opensans"><FiInstagram /> : oldklanghousejkt</p>
        </motion.div>

        <motion.div
          className="app__footer-links_logo"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.25 }}
        >
          <img src={images.okhWord} alt="footer_logo" />
          <p className="p__opensans">
            &quot;{t.quote}&quot;
          </p>
          <img
            src={images.spoon}
            className="spoon__img"
            style={{ marginTop: 15 }}
            alt="spoon"
          />
        </motion.div>

        {/* <motion.div
          className="app__footer-links_work"
          initial={{ opacity: 0, x: 56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <h1 className="app__footer-headtext"> {t.workingHours}</h1>
          <p className="p__opensans">{t.mondayFriday}</p>
          <p className="p__opensans">08:00 am - 12:00 am</p>
          <p className="p__opensans">{t.saturdaySunday}</p>
          <p className="p__opensans">07:00 am - 11:00 pm</p>
        </motion.div> */}
      </div>

      <motion.div
        className="footer__copyright"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: easeSmooth, delay: 0.5 }}
      >
        <p className="p__opensans">
          {new Date().getFullYear()} {t.copyright}
        </p>
      </motion.div>
    </div>
  );
};

export default Footer;
