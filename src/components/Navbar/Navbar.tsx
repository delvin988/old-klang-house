import React from "react";
import { motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import images from "../../constants/images";
import BookingModal from "../../container/BookModal/BookModal";
import "./Navbar.css";
import PhoneModal from "../../container/PhoneModal/PhoneModal";
import OtpModal from "../../container/OtpModal/OtpModal";

const navEase = [0.25, 0.46, 0.45, 0.94] as const;

const Navbar = () => {
  const [step, setStep] = React.useState<"phone" | "otp" | "booking" | null>(
    null,
  );
  const [phone, setPhone] = React.useState("");
  const [verifiedPhone, setVerifiedPhone] = React.useState("");
  const [toggleMenu, setToggleMenu] = React.useState(false);

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
              Home
            </a>
          </li>
          <li className="p__opensans">
            <a href="#about" onClick={handleNavClick}>
              About
            </a>
          </li>
          <li className="p__opensans">
            <a href="#menu" onClick={handleNavClick}>
              Menu
            </a>
          </li>
          {/* <li className="p__opensans"><a href="#awards" onClick={handleNavClick}>Awards</a></li> */}
          <li className="p__opensans">
            <a href="#contact" onClick={handleNavClick}>
              Contact
            </a>
          </li>
        </ul>
        <div className="app__navbar-login">
          <a
            href="https://wa.me/6282116824234"
            className="p__opensans"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Us
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
            Book Table
          </button>{" "}
        </div>
        <div className="app__navbar-smallscreen">
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
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={handleNavClick}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#menu" onClick={handleNavClick}>
                    Menu
                  </a>
                </li>
                {/* <li><a href="#awards" onClick={handleNavClick}>Awards</a></li> */}
                <li>
                  <a href="#contact" onClick={handleNavClick}>
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6282116824234"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message Us
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
                    Book Table
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
          setVerifiedPhone={setVerifiedPhone}
          onSuccess={() => setStep("otp")}
          onClose={() => setStep(null)}
        />
      )}

      {step === "otp" && (
        <OtpModal
          phone={verifiedPhone}
          onSuccess={() => setStep("booking")}
          onClose={() => setStep(null)}
        />
      )}

      {step === "booking" && (
        <BookingModal
          open={true}
          setOpen={() => setStep(null)}
          phone={verifiedPhone}
        />
      )}
    </>
  );
};

export default Navbar;
