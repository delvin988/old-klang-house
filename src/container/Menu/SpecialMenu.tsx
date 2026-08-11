import React from "react";
import { motion, useInView } from "framer-motion";

import { SubHeading, MenuItem } from "../../components";
import { data, images } from "../../constants";
import "./SpecialMenu.css";

const easeSmooth = [0.65, 0, 0.35, 1] as const;
const translations = {
  en: {
    subtitle: "Discover Our Flavors",
    title: "Signature Selections",
    signature: "Foods",
    beverages: "Drinks",
  },

  id: {
    subtitle: "Temukan Cita Rasa Kami",
    title: "Hidangan Pilihan",
    signature: "Makanan",
    beverages: "Minuman",
  },
};
type Props = {
  language: "en" | "id";
};

const SpecialMenu: React.FC<Props> = ({ language }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const t = translations[language];
  const [menus, setMenus] = React.useState<any[]>([]);
  const getLanguageValue = (value: string, language: "en" | "id") => {
    const match = value.match(/EN\/(.*?)\/ID\/(.*)/);

    if (!match) {
      return value;
    }

    return language === "en" ? match[1] : match[2];
  };
  React.useEffect(() => {
    fetch("https://okhrestaurant-ca7148d529c4.herokuapp.com/api/menus")
      .then((res) => res.json())
      .then((data) => {
        const specialMenus = data.filter((menu: any) => menu.todaySpecial);

        setMenus(specialMenus);
      });
  }, []);
  const foodMenus = menus.filter(
    (menu) => menu.category.name === "Today special makanan",
  );

  const beverageMenus = menus.filter(
    (menu) => menu.category.name === "Today special minuman",
  );
  return (
    <div
      ref={ref}
      className="app__specialMenu app__bg flex__center section__padding"
      id="menu"
    >
      <motion.div
        className="app__specialMenu-title"
        initial={{ opacity: 0, y: -32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: easeSmooth }}
      >
        <SubHeading title={t.subtitle} />
        <h1 className="headtext__cormorant">{t.title}</h1>
      </motion.div>

      <div className="app__specialMenu-menu">
        <motion.div
          className="app__specialMenu-menu_wine flex__center"
          initial={{ opacity: 0, x: -56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <p className="app__specialMenu-menu_heading">{t.signature}</p>
          <div className="app__specialMenu_menu_items">
            {foodMenus.map((menu) => (
              <MenuItem
                key={menu.id}
                title={getLanguageValue(menu.name, language)}
                price=""
                tags={getLanguageValue(menu.description, language)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="app__specialMenu-menu_img"
          style={{ transformOrigin: "center bottom" }}
          initial={{ opacity: 0, y: "60%" }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 1.15,
            ease: [0.22, 0.61, 0.36, 1],
            delay: 0.2,
          }}
        >
          <img src={images.menu} alt="menu__img" />
        </motion.div>

        <motion.div
          className="app__specialMenu-menu_cocktails flex__center"
          initial={{ opacity: 0, x: 56 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth, delay: 0.1 }}
        >
          <p className="app__specialMenu-menu_heading">{t.beverages}</p>
          <div className="app__specialMenu_menu_items">
            {beverageMenus.map((menu) => (
              <MenuItem
                key={menu.id}
                title={getLanguageValue(menu.name, language)}
                price=""
                tags={getLanguageValue(menu.description, language)}
              />
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
        {/* <button type="button" className="custom__button">View More</button> */}
      </motion.div>
    </div>
  );
};

export default SpecialMenu;
