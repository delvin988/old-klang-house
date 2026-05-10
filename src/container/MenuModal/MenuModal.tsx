import React from "react";
import "./MenuModal.css";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWantMenu: React.Dispatch<React.SetStateAction<string>>;
  setSelectedMenus: React.Dispatch<
    React.SetStateAction<
      {
        menuId: number;
        menuName: string;
        qty: number;
      }[]
    >
  >;
};

type MenuItem = {
  id: number;
  category: string;
  name: string;
  description: string;
};

const menus: MenuItem[] = [
  {
    id: 1,
    category: "Bak Kut Teh",
    name: "Signature Bak Kut Teh",
    description: "Classic herbal pork rib soup slow-cooked with premium spices",
  },
  {
    id: 2,
    category: "Bak Kut Teh",
    name: "Dry Bak Kut Teh",
    description:
      "Rich and spicy dry-style bak kut teh with dried chili and okra",
  },
  {
    id: 3,
    category: "Bak Kut Teh",
    name: "Seafood Bak Kut Teh",
    description:
      "Herbal broth served with fresh prawns, squid, and fish fillet",
  },
  {
    id: 4,
    category: "Rice & Noodles",
    name: "Yam Rice",
    description: "Fragrant yam rice cooked with dried shrimp and mushrooms",
  },
  {
    id: 5,
    category: "Rice & Noodles",
    name: "Mee Sua",
    description: "Soft wheat noodles served in comforting herbal broth",
  },
  {
    id: 6,
    category: "Side Dish",
    name: "Braised Chicken Feet",
    description: "Slow-braised chicken feet in savory dark soy sauce",
  },
  {
    id: 7,
    category: "Side Dish",
    name: "Tofu Skin Roll",
    description: "Crispy tofu skin rolls filled with seasoned minced meat",
  },
  {
    id: 8,
    category: "Side Dish",
    name: "Salted Vegetables",
    description: "Traditional preserved mustard greens with garlic flavor",
  },
  {
    id: 9,
    category: "Drinks",
    name: "Chinese Tea",
    description: "Hot traditional Chinese tea served fresh daily",
  },
  {
    id: 10,
    category: "Drinks",
    name: "Barley Drink",
    description: "Refreshing homemade barley drink served chilled",
  },
  {
    id: 11,
    category: "Dessert",
    name: "Peanut Mochi",
    description: "Soft chewy mochi coated with roasted peanut powder",
  },
  {
    id: 12,
    category: "Dessert",
    name: "Black Sesame Tang Yuan",
    description: "Glutinous rice balls filled with black sesame paste",
  },
];

const MenuModal: React.FC<Props> = ({
  open,
  setOpen,
  setWantMenu,
  setSelectedMenus,
}) => {
  const [qty, setQty] = React.useState<Record<number, number>>({});
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  const categories = [...new Set(menus.map((menu) => menu.category))];

  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);

  if (!open) return null;

  const increaseQty = (id: number) => {
    setQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQty = (id: number) => {
    setQty((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const totalItems = Object.values(qty).reduce(
    (sum, current) => sum + current,
    0,
  );

  const handleClose = () => {
    const hasSelectedMenu = Object.values(qty).some((value) => value > 0);

    if (hasSelectedMenu) {
      setShowCancelConfirm(true);
      return;
    }

    setWantMenu("no");
    setSelectedMenus([]);
    setOpen(false);
  };

  return (
    <>
      <div
        className="modal__overlay"
        onClick={() => {
          if (!showCancelConfirm) {
            handleClose();
          }
        }}
      >
        <div
          className="menuModal__container"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal__close" onClick={handleClose}>
            ×
          </button>

          <h2 className="menuModal__title">Select Menu</h2>

          <div className="menuModal__categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`menuModal__categoryButton ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menuModal__list">
            {menus
              .filter((menu) => menu.category === selectedCategory)
              .map((menu) => (
                <div key={menu.id} className="menuCard">
                  <div className="menuCard__content">
                    <div>
                      <h3>{menu.name}</h3>

                      <p className="menuCard__description">
                        {menu.description}
                      </p>
                    </div>

                    <div className="menuCard__bottom">
                      <div className="menuCard__qty">
                        <button onClick={() => decreaseQty(menu.id)}>-</button>

                        <span>{qty[menu.id] || 0}</span>

                        <button onClick={() => increaseQty(menu.id)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="menuModal__summarySimple">
            {menus
              .filter((menu) => (qty[menu.id] || 0) > 0)
              .map((menu) => (
                <div key={menu.id} className="menuModal__summaryCompact">
                  <div>
                    <span className="menuModal__summaryCompactCategory">
                      {menu.category}
                    </span>

                    <p className="menuModal__summaryCompactName">{menu.name}</p>
                  </div>

                  <span className="menuModal__summaryCompactQty">
                    x{qty[menu.id]}
                  </span>
                </div>
              ))}

            <button
              className="menuModal__save"
              onClick={() => {
                const formattedMenus = menus
                  .filter((menu) => (qty[menu.id] || 0) > 0)
                  .map((menu) => ({
                    menuId: menu.id,
                    menuName: menu.name,
                    qty: qty[menu.id],
                  }));

                setSelectedMenus(formattedMenus);

                setOpen(false);
              }}
            >
              Save Menu
            </button>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div
          className="modal__overlay confirmOverlay"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Selection?</h3>

            <p>Your selected menu items will not be saved.</p>

            <div className="confirmModal__actions">
              <button
                className="confirmModal__secondary"
                onClick={() => setShowCancelConfirm(false)}
              >
                Continue
              </button>

              <button
                className="confirmModal__primary"
                onClick={() => {
                  setQty({});
                  setWantMenu("no");

                  setShowCancelConfirm(false);
                  setOpen(false);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuModal;
