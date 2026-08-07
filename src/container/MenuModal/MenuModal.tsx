import React from "react";
import "./MenuModal.css";

type Props = {
  language: "en" | "id";
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

const MenuModal: React.FC<Props> = ({
  language,
  open,
  setOpen,
  setWantMenu,
  setSelectedMenus,
}) => {
  const [qty, setQty] = React.useState<Record<number, number>>({});
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [menus, setMenus] = React.useState<MenuItem[]>([]);
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
        const activeMenus = data
          .filter((menu: any) => menu.active)
          .map((menu: any) => ({
            id: menu.id,

            category: menu.category.name,

            name: getLanguageValue(menu.name, language),

            description: getLanguageValue(menu.description, language),
          }));

        setMenus(activeMenus);
      });
  }, [language]);
  const categories = [...new Set(menus.map((menu) => menu.category))];

  const [selectedCategory, setSelectedCategory] = React.useState("");
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);
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
