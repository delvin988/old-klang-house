import React from "react";
import PropTypes from "prop-types";
import { motion, useInView } from "framer-motion";

import { SubHeading } from "../../components";
import { images, data } from "../../constants";
import "./Laurels.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const AwardCard = ({
  award: { imgUrl, title, subtitle },
  isInView,
  index,
}: {
  award: { imgUrl: string; title: string; subtitle: string };
  isInView: boolean;
  index: number;
}) => (
  <motion.div
    className="app__laurels_awards-card"
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.85, ease: easeSmooth, delay: 0.1 + index * 0.09 }}
  >
    <img src={imgUrl} alt="awards" />
    <div className="app__laurels_awards-card_content">
      <p className="p__cormorant" style={{ color: "#DCCA87" }}>
        {title}
      </p>
      <p className="p__opensans">{subtitle}</p>
    </div>
  </motion.div>
);

const Laurels = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="app__laurels app__bg app__wrapper section__padding" id="awards">
      <motion.div
        className="app__wrapper_info"
        initial={{ opacity: 0, x: -48 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth }}
      >
        <SubHeading title="Awards & recognition" />
        <h1 className="headtext__cormorant">Our Laurels</h1>

        <div className="app__laurels_awards">
          {data.awards.map((award, index) => (
            <AwardCard award={award} key={award.title} isInView={isInView} index={index} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="app__wrapper_img"
        initial={{ opacity: 0, x: 48 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth, delay: 0.15 }}
      >
        <img src={images.laurels} alt="laurels_img" />
      </motion.div>
    </div>
  );
};

export default Laurels;

