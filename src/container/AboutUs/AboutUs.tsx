import React from "react";
import { motion, useInView } from "framer-motion";

import { images } from "../../constants";
import "./AboutUs.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;
const translations = {
  en: {
    aboutTitle: "About Us",

    aboutDescription:
      "At OKH Restaurant, every dish is prepared with passion, quality ingredients, and attention to detail. We strive to create a warm and welcoming dining experience where family and friends can gather, share meaningful moments, and enjoy unforgettable flavors.",

    historyTitle: "Our Story",

    historyDescription:
      "What began as a simple passion for great food has grown into a destination for authentic flavors and memorable dining experiences. Through dedication, consistency, and heartfelt hospitality, OKH Restaurant continues to serve every guest with pride.",
  },

  id: {
    aboutTitle: "Tentang Kami",

    aboutDescription:
      "Di OKH Restaurant, setiap hidangan disiapkan dengan penuh dedikasi, menggunakan bahan-bahan berkualitas dan perhatian pada setiap detail. Kami berkomitmen menghadirkan pengalaman bersantap yang hangat dan nyaman, tempat keluarga serta sahabat dapat berkumpul dan menikmati cita rasa yang berkesan.",

    historyTitle: "Perjalanan Kami",

    historyDescription:
      "Berawal dari kecintaan terhadap makanan berkualitas, OKH Restaurant tumbuh menjadi tempat yang menghadirkan cita rasa autentik dan pengalaman bersantap yang istimewa. Dengan komitmen terhadap kualitas, konsistensi, dan pelayanan sepenuh hati, kami terus melayani setiap pelanggan dengan bangga.",
  },
};
type Props = {
  language: "en" | "id";
};

const AboutUs: React.FC<Props> = ({
  language,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const t = translations[language];

  return (
    <div
      ref={ref}
      className="app__aboutus app__bg flex__center section__padding"
      id="about"
    >
      <div className="app__aboutus-overlay flex__center">
        <img src={images.G} alt="G_overlay" />
      </div>

      <div className="app__aboutus-content flex__center">
        <motion.div
          className="app__aboutus-content_about"
          initial={{ opacity: 0, x: -48 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth }}
        >
          <h1 className="headtext__cormorant">{t.aboutTitle}</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            {t.aboutDescription}
          </p>
          
        </motion.div>

        {/* <motion.div
          className="app__aboutus-content_knife flex__center"
          style={{ transformOrigin: 'center bottom' }}
        >
          <motion.img
            src={images.knife}
            alt="about_knife"
            initial={{ opacity: 0, y: '80%' }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </motion.div> */}
        <div className="app__aboutus-spacer" />

        <motion.div
          className="app__aboutus-content_history"
          initial={{ opacity: 0, x: 48 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth }}
        >
          <h1 className="headtext__cormorant"> {t.historyTitle}</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            {t.historyDescription}
          </p>
          
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
