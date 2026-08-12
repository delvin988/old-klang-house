import React from "react";
import { motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import images from "../../constants/images";
import BookingModal from "../../container/BookModal/BookModal";
import "./Navbar.css";
import PhoneModal from "../../container/PhoneModal/PhoneModal";
import OtpModal from "../../container/OtpModal/OtpModal";

type Props = {
  language: "en" | "id";
  setLanguage: React.Dispatch<React.SetStateAction<"en" | "id">>;
};
const navEase = [0.25, 0.46, 0.45, 0.94] as const;
const translations = {
  en: {
    home: "Home",
    about: "About",
    menu: "Signature Selection",
    contact: "Menu and Location",
    messageUs: "Message Us",
    bookTable: "Book Table",
  },

  id: {
    home: "Beranda",
    about: "Tentang Kami",
    menu: "Hidangan Pilihan",
    contact: "Menu dan Lokasi",
    messageUs: "Hubungi Kami",
    bookTable: "Reservasi Meja",
  },
};
const Navbar: React.FC<Props> = ({ language, setLanguage }) => {
  const [step, setStep] = React.useState<"phone" | "otp" | "booking" | null>(
    null,
  );
  const [phone, setPhone] = React.useState("");
  const [verifiedPhone, setVerifiedPhone] = React.useState("");
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [showLanguage, setShowLanguage] = React.useState(false);
  const t = translations[language];
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setToggleMenu(false);
  };

  return (
    <>
      <motion.nav
        className="app__navbar"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: navEase }}
      >
        <div className="app__navbar-logo">
          <img src={images.okh} alt="app__logo" className="logo__icon" />
          <img src={images.okhWord} alt="app__logo2" className="logo__text" />
        </div>
        <ul className="app__navbar-links">
          <li className="p__opensans">
            <a href="#home" onClick={handleNavClick}>
              {t.home}
            </a>
          </li>
          <li className="p__opensans">
            <a href="#about" onClick={handleNavClick}>
              {t.about}
            </a>
          </li>
          <li className="p__opensans">
            <a href="#menu" onClick={handleNavClick}>
              {t.menu}
            </a>
          </li>
          {/* <li className="p__opensans"><a href="#awards" onClick={handleNavClick}>Awards</a></li> */}
          <li className="p__opensans">
            <a href="#contact" onClick={handleNavClick}>
              {t.contact}
            </a>
          </li>
        </ul>
        <div className="app__navbar-login">
          <span
            style={{
              margin: "0 1rem",
              position: "relative",
            }}
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "id")}
              className="p__opensans language-select"
            >
              <option value="en">EN</option>

              <option value="id">ID</option>
            </select>
          </span>

          <div />

          <a
            href="https://wa.me/6285218281537"
            className="p__opensans"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.messageUs}
          </a>

          <div />

          <button
            className="p__opensans"
            onClick={() => setStep("phone")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: "1rem",
            }}
          >
            {t.bookTable}{" "}
          </button>
        </div>

        <div className="app__navbar-smallscreen">
          <div style={{ position: "relative" }}>
            <span
              className="p__opensans"
              style={{
                marginRight: "12px",
                cursor: "pointer",
                color: "#5A4632",
                fontSize: "14px",
              }}
            >
              {language === "en" ? "EN" : "ID"} ▼
            </span>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "id")}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            >
              <option value="en">EN</option>
              <option value="id">ID</option>
            </select>
          </div>
          <GiHamburgerMenu
            color="#5A4632"
            fontSize={27}
            onClick={() => setToggleMenu(true)}
          />
          {toggleMenu && (
            <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
              <MdOutlineRestaurantMenu
                fontSize={27}
                className="overlay__close"
                onClick={() => setToggleMenu(false)}
              />
              <ul className="app__navbar-smallscreen_links">
                <li>
                  <a href="#home" onClick={handleNavClick}>
                    {t.home}
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={handleNavClick}>
                    {t.about}
                  </a>
                </li>
                <li>
                  <a href="#menu" onClick={handleNavClick}>
                    {t.menu}
                  </a>
                </li>
                {/* <li><a href="#awards" onClick={handleNavClick}>Awards</a></li> */}
                <li>
                  <a href="#contact" onClick={handleNavClick}>
                    {t.contact}
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6285218281537"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.messageUs}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setStep("phone");
                      setToggleMenu(false);
                    }}
                  >
                    {t.bookTable}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </motion.nav>

      {step === "phone" && (
        <PhoneModal
          phone={phone}
          setPhone={setPhone}
          language={language}
          setVerifiedPhone={setVerifiedPhone}
          onSuccess={() => setStep("otp")}
          onClose={() => setStep(null)}
        />
      )}

      {step === "otp" && (
        <OtpModal
          phone={verifiedPhone}
          language={language}
          onSuccess={() => setStep("booking")}
          onClose={() => setStep(null)}
        />
      )}

      {step === "booking" && (
        <BookingModal
          open={true}
          language={language}
          setOpen={() => setStep(null)}
          phone={verifiedPhone}
        />
      )}
    </>
  );
};

export default Navbar;
