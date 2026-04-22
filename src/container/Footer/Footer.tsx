import React from "react";
import { motion, useInView } from "framer-motion";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

import { FooterOverlay, Newsletter } from "../../components";
import { images } from "../../constants";
import "./Footer.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const Footer = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="app__footer section__padding" id="login">
      <FooterOverlay />
      <Newsletter />

      <div className="app__footer-links">
        <motion.div
          className="app__footer-links_contact"
          initial={{ opacity: 0, x: -56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <h1 className="app__footer-headtext">Contact Us</h1>
          <p className="p__opensans">9 W 53rd St, Jakarta, JKT 10019, IDN</p>
          <p className="p__opensans">+62 81-23-456</p>
          <p className="p__opensans">+61 22-555-1230</p>
        </motion.div>

        <motion.div
          className="app__footer-links_logo"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.25 }}
        >
          <img src={images.okhWord} alt="footer_logo" />
          <p className="p__opensans">
            &quot;The best way to find yourself is to lose yourself in the service
            of others.&quot;
          </p>
          <img
            src={images.spoon}
            className="spoon__img"
            style={{ marginTop: 15 }}
            alt="spoon"
          />
          <div className="app__footer-links_icons">
            <FiFacebook />
            <FiTwitter />
            <FiInstagram />
          </div>
        </motion.div>

        <motion.div
          className="app__footer-links_work"
          initial={{ opacity: 0, x: 56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <h1 className="app__footer-headtext">Working Hours</h1>
          <p className="p__opensans">Monday-Friday:</p>
          <p className="p__opensans">08:00 am - 12:00 am</p>
          <p className="p__opensans">Saturday-Sunday:</p>
          <p className="p__opensans">07:00 am - 11:00 pm</p>
        </motion.div>
      </div>

      <motion.div
        className="footer__copyright"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: easeSmooth, delay: 0.5 }}
      >
        <p className="p__opensans">
          {new Date().getFullYear()} Restaurant Old Klang House. All Rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Footer;
