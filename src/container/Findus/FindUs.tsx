import React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

import { SubHeading } from "../../components";
import { images } from "../../constants";

import "./FindUs.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const translations = {
  en: {
    subtitle: "Explore",
    title: "Menu and Location",

    intro:
      "Visit us for an authentic Bak Kut Teh experience. Scan the QR code to explore our menu and find us easily.",

    locationTitle: "Our Location",
    address:
      "Aniva Junction Ruko, Blk. B No.29, Medang, Pagedangan, Tangerang Regency, Banten 15334",

    openingHours: "Opening Hours",
    weekdayHours: "Mon - Sun: 10:00 - 22:00",

    directions: "Get Directions",

    menuTitle: "Our Menu",
    menuDescription:
      "Explore our signature Bak Kut Teh, sides, drinks, and more.",

    scanMenu: "Scan to view our full menu",
    viewMenu: "View Menu",
  },

  id: {
    subtitle: "Jelajahi",
    title: "Menu dan Lokasi",

    intro:
      "Kunjungi kami untuk menikmati Bak Kut Teh autentik. Scan QR code untuk melihat menu lengkap dan menemukan lokasi kami.",

    locationTitle: "Lokasi Kami",
    address:
      "Aniva Junction Ruko, Blk. B No.29, Medang, Pagedangan, Tangerang Regency, Banten 15334",

    openingHours: "Jam Operasional",
    weekdayHours: "Sen - Min: 10:00 - 22:00",

    directions: "Lihat Lokasi",

    menuTitle: "Menu Kami",
    menuDescription:
      "Jelajahi Bak Kut Teh, hidangan pendamping, minuman, dan lainnya.",

    scanMenu: "Scan untuk melihat menu lengkap",
    viewMenu: "Lihat Menu",
  },
};

type Props = {
  language: "en" | "id";
};

const FindUs: React.FC<Props> = ({ language }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const t = translations[language];
  const [showMenu, setShowMenu] = React.useState(false);


  const handleDirections = () => {
    window.open(
      "https://www.google.com/maps/place/Old+Klang+House+Bak+Kut+Teh/@-6.2705159,106.6218729,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69fd00288fc3af:0xb09e72bffa00ebcd!8m2!3d-6.2705159!4d106.6244478!16s%2Fg%2F11zd14kbtr?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
      "_blank"
    );
  };

  const handleViewMenu = () => {
    // NANTI GANTI LINK INI DENGAN LINK MENU ASLI
    window.open(images.menuQr, "_blank");
  };

  return (
    <div
      ref={ref}
      className="app__findus app__bg section__padding"
      id="contact"
    >
      <div className="app__findus-container">

        {/* ================= LEFT ================= */}
        <motion.div
          className="app__findus-left"
          initial={{
            opacity: 0,
            x: -48,
          }}
          animate={
            isInView
              ? {
                opacity: 1,
                x: 0,
              }
              : {}
          }
          transition={{
            duration: 1,
            ease: easeSmooth,
          }}
        >
          <SubHeading title={t.subtitle} />

          <h1 className="app__findus-title">
            {t.title}
          </h1>

          <p className="app__findus-intro p__opensans">
            {t.intro}
          </p>

          {/* LOCATION */}
          <div className="app__findus-info-block">

            <div className="app__findus-info-heading">
              <div className="app__findus-icon">
                <span>●</span>
              </div>

              <h3>{t.locationTitle}</h3>
            </div>

            <p className="p__opensans app__findus-address">
              {t.address}
            </p>

          </div>

          <div className="app__findus-divider" />

          {/* OPENING HOURS */}
          <div className="app__findus-info-block">

            <div className="app__findus-info-heading">
              <div className="app__findus-icon app__findus-clock">
                <span>◷</span>
              </div>

              <h3>{t.openingHours}</h3>
            </div>

            <p className="p__opensans app__findus-hours">
              {t.weekdayHours}
            </p>

          </div>

          <button
            type="button"
            className="custom__button app__findus-directions"
            onClick={handleDirections}
          >
            <span className="app__findus-button-icon">
              ●
            </span>

            {t.directions}
          </button>
        </motion.div>


        {/* ================= CENTER DIVIDER ================= */}
        <motion.div
          className="app__findus-center-divider"
          initial={{ opacity: 0 }}
          animate={
            isInView
              ? { opacity: 1 }
              : {}
          }
          transition={{
            duration: 1,
            delay: 0.2,
          }}
        >
          <span />
          <div>◆</div>
          <span />
        </motion.div>


        {/* ================= RIGHT ================= */}
        <motion.div
          className="app__findus-right"
          initial={{
            opacity: 0,
            x: 48,
          }}
          animate={
            isInView
              ? {
                opacity: 1,
                x: 0,
              }
              : {}
          }
          transition={{
            duration: 1,
            ease: easeSmooth,
            delay: 0.12,
          }}
        >

          <div className="app__findus-menu-card">

            <div className="app__findus-menu-icon">
              <span>♨</span>
            </div>

            <h2 className="app__findus-menu-title">
              {t.menuTitle}
            </h2>

            <p className="p__opensans app__findus-menu-description">
              {t.menuDescription}
            </p>


            {/* QR */}
            <div className="app__findus-qr-box">
              <img
                src={images.menuQr}
                alt="Old Klang House Menu QR Code"
                className="app__findus-qr"
              />
            </div>


            <div className="app__findus-menu-separator">
              <span />
              <div>◆</div>
              <span />
            </div>


            <p className="app__findus-scan-text">
              {t.scanMenu}
            </p>


            <button
              type="button"
              className="custom__button app__findus-menu-button"
              onClick={() => setShowMenu(true)}
            >
              {t.viewMenu}
            </button>

          </div>

        </motion.div>

      </div>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="menu__popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              className="menu__popup"
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              transition={{
                duration: 0.35,
                ease: easeSmooth,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="menu__popup-close"
                onClick={() => setShowMenu(false)}
                aria-label="Close menu"
              >
                ×
              </button>

              <img
                src={images.menuOkh}
                alt="Old Klang House Menu"
                className="menu__popup-image"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default FindUs;