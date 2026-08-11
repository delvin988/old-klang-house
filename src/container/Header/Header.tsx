import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: easeSmooth,
    },
  },
};

const translations = {
  en: {
    subtitle: "Savour The Authentic Taste",
    title: "The Essence Of Bak Kut Teh",
    description:
      "A rich and aromatic broth, carefully prepared with premium ingredients and slow-cooked to perfection. Every bowl delivers comforting warmth, deep flavors, and an unforgettable dining experience.",
    button: "Book A Table",
  },

  id: {
    subtitle: "Nikmati Cita Rasa Otentik",
    title: "Esensi Bak Kut Teh",
    description:
      "Kuah yang kaya rasa dan aromatik, dibuat dengan bahan-bahan pilihan serta dimasak perlahan hingga sempurna. Setiap mangkuk menghadirkan kehangatan, cita rasa yang mendalam, dan pengalaman bersantap yang tak terlupakan.",
    button: "Reservasi Meja",
  },
};

/* GAMBAR SLIDER */
const heroImages = [
  images.food_header2,
  images.food_header5,
  images.food_header4,
  images.food_header7,
  images.food_header9,
  images.food_header10
];

type Props = {
  language: "en" | "id";
  setLanguage: React.Dispatch<
    React.SetStateAction<"en" | "id">
  >;
};

const Header: React.FC<Props> = ({
  language,
  setLanguage,
}) => {
  const [step, setStep] = React.useState<
    "phone" | "otp" | "booking" | null
  >(null);

  const [phone, setPhone] = React.useState("");
  const [verifiedPhone, setVerifiedPhone] =
    React.useState("");

  /* INI HARUS DI DALAM HEADER */
  const [currentImage, setCurrentImage] =
    React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        return (prev + 1) % heroImages.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const t = translations[language];

  return (
    <>
    <div className="app__header-wrapper">
        <Navbar language={language} setLanguage={setLanguage} />

      <motion.div
        className="app__header app__bg app__wrapper section__padding"
        id="home"
        initial="hidden"
        animate="visible"
        variants={heroContainerVariants}
      >
        {/* LEFT */}
        <motion.div
          className="app__wrapper_info"
          variants={leftColumnVariants}
        >
          <motion.div variants={itemVariants}>
            <SubHeading title={t.subtitle} />
          </motion.div>

          <motion.h1
            className="app__header-h1"
            variants={itemVariants}
          >
            {t.title}
          </motion.h1>

          <motion.p
            className="p__opensans"
            style={{ margin: "2rem 0" }}
            variants={itemVariants}
          >
            {t.description}
          </motion.p>

          <motion.div variants={itemVariants}>
            <button
              type="button"
              className="custom__button"
              onClick={() => setStep("phone")}
            >
              {t.button}
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE SLIDER */}
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
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={heroImages[currentImage]}
              alt={`hero-${currentImage + 1}`}
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -40,
              }}
              transition={{
                duration: 0.7,
                ease: easeSmooth,
              }}
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>

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
      </div>
    </>
  );
};

export default Header;