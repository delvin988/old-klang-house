import React from "react";
import { motion } from "framer-motion";

import { SubHeading, Navbar } from "../../components";
import { images } from "../../constants";
import "./Header.css";
import PhoneModal from "../../container/PhoneModal/PhoneModal";
import OtpModal from "../../container/OtpModal/OtpModal";
import BookingModal from "../../container/BookModal/BookModal";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const leftColumnVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: easeSmooth },
  },
};

const Header = () => {
  const [step, setStep] = React.useState<
    "phone" | "otp" | "booking" | null
  >(null);

  const [phone, setPhone] = React.useState("");

  const [verifiedPhone, setVerifiedPhone] =
    React.useState("");

  return (
    <>
      <div className="app__header-wrapper">
        <Navbar />

        <motion.div
          className="app__header app__bg app__wrapper section__padding"
          id="home"
          initial="hidden"
          animate="visible"
          variants={heroContainerVariants}
        >
          <motion.div
            className="app__wrapper_info"
            variants={leftColumnVariants}
          >
            <motion.div variants={itemVariants}>
              <SubHeading title="Savour The Authentic Taste" />
            </motion.div>

            <motion.h1
              className="app__header-h1"
              variants={itemVariants}
            >
              The Essence Of Bak Kut Teh
            </motion.h1>

            <motion.p
              className="p__opensans"
              style={{ margin: "2rem 0" }}
              variants={itemVariants}
            >
              A rich and aromatic herbal broth,
              slow-cooked with tender pork ribs and
              infused with traditional Malaysian
              spices. A timeless comfort dish that
              delivers depth, warmth, and unforgettable
              flavor in every bite.
            </motion.p>

            <motion.div variants={itemVariants}>
              <button
                type="button"
                className="custom__button"
                onClick={() => setStep("phone")}
              >
                Book A Table
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="app__wrapper_img"
            initial={{
              opacity: 0,
              x: 48,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 1.35,
              ease: easeSmooth,
              delay: 0.45,
            }}
          >
            <motion.img
              src={images.food}
              alt="header_img"
              initial={{
                opacity: 0,
                scale: 1.06,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.2,
                ease: easeSmooth,
                delay: 0.55,
              }}
            />
          </motion.div>
        </motion.div>

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
      </div>
    </>
  );
};

export default Header;
