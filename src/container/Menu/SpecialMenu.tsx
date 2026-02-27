import React from 'react';
import { motion, useInView } from 'framer-motion';

import { SubHeading, MenuItem } from '../../components';
import { data, images } from '../../constants';
import './SpecialMenu.css';

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const SpecialMenu = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div ref={ref} className="app__specialMenu flex__center section__padding" id="menu">
      <motion.div
        className="app__specialMenu-title"
        initial={{ opacity: 0, y: -32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: easeSmooth }}
      >
        <SubHeading title="Menu that fits your palatte" />
        <h1 className="headtext__cormorant">Today&apos;s Special</h1>
      </motion.div>

      <div className="app__specialMenu-menu">
        <motion.div
          className="app__specialMenu-menu_wine flex__center"
          initial={{ opacity: 0, x: -56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <p className="app__specialMenu-menu_heading">Wine & Beer</p>
          <div className="app__specialMenu_menu_items">
            {data.wines.map((wine, index) => (
              <MenuItem key={wine.title + index} title={wine.title} price={wine.price} tags={wine.tags} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="app__specialMenu-menu_img"
          style={{ transformOrigin: 'center bottom' }}
          initial={{ opacity: 0, y: '60%' }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.15, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
        >
          <img src={images.menu} alt="menu__img" />
        </motion.div>

        <motion.div
          className="app__specialMenu-menu_cocktails flex__center"
          initial={{ opacity: 0, x: 56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <p className="app__specialMenu-menu_heading">Cocktails</p>
          <div className="app__specialMenu_menu_items">
            {data.cocktails.map((cocktail, index) => (
              <MenuItem key={cocktail.title + index} title={cocktail.title} price={cocktail.price} tags={cocktail.tags} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ marginTop: 15 }}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: easeSmooth, delay: 0.4 }}
      >
        <button type="button" className="custom__button">View More</button>
      </motion.div>
    </div>
  );
};

export default SpecialMenu;
