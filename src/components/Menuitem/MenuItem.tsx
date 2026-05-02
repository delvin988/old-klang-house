import React from "react";
import PropTypes from "prop-types";

import "./MenuItem.css";

interface MenuItemProps {
  title: string;
  price: string;
  tags: string;
}

const MenuItem = ({ title, price, tags }: MenuItemProps) => (
  <div className="app__menuitem">
    <div className="app__menuitem-head">
      <div className="app__menuitem-name">
        <p className="p__cormorant" style={{ color: "#A63A1F" }}>
          {title}
        </p>
      </div>
      <div className="app__menuitem-dash" />
      <div className="app__menuitem-price">
        <p className="p__cormorant" style={{ color: "#3E2F1C" }}>{price}</p>
      </div>
    </div>

    <div className="app__menuitem-sub">
      <p className="p__opensans" style={{ color: "#6B5E4B" }}>
        {tags}
      </p>
    </div>
  </div>
);

export default MenuItem;

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
