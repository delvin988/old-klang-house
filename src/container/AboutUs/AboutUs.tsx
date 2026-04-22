import React from "react";
import { motion, useInView } from "framer-motion";

import { images } from "../../constants";
import "./AboutUs.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const AboutUs = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
          <h1 className="headtext__cormorant">About Us</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis
            pharetra adipiscing ultrices vulputate posuere tristique. In sed
            odio nec aliquet eu proin mauris et.
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
          <h1 className="headtext__cormorant">History</h1>
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          <p className="p__opensans">
            Adipiscing tempus ullamcorper lobortis odio tellus arcu volutpat.
            Risus placerat morbi volutpat habitasse interdum mi aliquam In sed
            odio nec aliquet.
          </p>
          
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
