import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CustomerMenu.css";

type Category = {
  id: number;
  name: string;
};

type Menu = {
  id: number;
  name: string;
  description: string;
  category: Category;
  price: number;
  active: boolean;
  todaySpecial: boolean;
  qrOrderEnabled: boolean;
  qrOrderAvailable: boolean;
};

type CartItem = {
  menu: Menu;
  quantity: number;
  notes: string;
};
type CustomerOrderItem = {
  id: number;
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
  notes: string | null;
  subtotal: number;
  status: "ACTIVE" | "CANCELLED";
};

type CustomerOrder = {
  orderId: number;
  sessionId: number;
  tableNumber: string;
  status: "NEW" | "PREPARING" | "SERVED" | "CANCELLED";
  subtotal: number;
  createdAt: string;
  items: CustomerOrderItem[];
};
const API_BASE_URL = "https://okhrestaurant-ca7148d529c4.herokuapp.com";

const CustomerMenu = () => {
  const [orders, setOrders] =
    React.useState<CustomerOrder[]>([]);

  const [showOrders, setShowOrders] =
    React.useState(false);

  const [ordersLoading, setOrdersLoading] =
    React.useState(false);
  const navigate = useNavigate();
  const { qrToken } = useParams();

  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedCategory, setSelectedCategory] =
    React.useState<number | "ALL">("ALL");
  const [language, setLanguage] =
    React.useState<"EN" | "ID">("EN");
  const [cart, setCart] =
    React.useState<CartItem[]>([]);

  const [showCart, setShowCart] =
    React.useState(false);

  const [selectedMenu, setSelectedMenu] =
    React.useState<Menu | null>(null);

  const [selectedNotes, setSelectedNotes] =
    React.useState("");

  const [selectedQuantity, setSelectedQuantity] =
    React.useState(1);

  const [placingOrder, setPlacingOrder] =
    React.useState(false);

  const [orderSuccess, setOrderSuccess] =
    React.useState(false);

  const [orderId, setOrderId] =
    React.useState<number | null>(null);
  const loadOrders = async () => {
    if (!qrToken) {
      return;
    }

    try {
      setOrdersLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/session?qrToken=${qrToken}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load orders.",
        );
      }

      setOrders(data);

    } catch (error) {

      console.error(
        "Failed to load orders:",
        error,
      );

    } finally {

      setOrdersLoading(false);

    }
  };
  const loadMenus = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/menus/qr-order`,
      );

      if (!response.ok) {
        throw new Error("Failed to load menu");
      }

      const data: Menu[] =
        await response.json();

      setMenus(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadMenus();
  }, []);
  React.useEffect(() => {
    loadOrders();

    const interval =
      setInterval(() => {
        loadOrders();
      }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [qrToken]);
  const categories = React.useMemo(() => {

    const map = new Map<number, Category>();

    menus.forEach((menu) => {

      if (!map.has(menu.category.id)) {
        map.set(
          menu.category.id,
          menu.category,
        );
      }

    });

    return Array.from(map.values());

  }, [menus]);

  const filteredMenus =
    selectedCategory === "ALL"
      ? menus
      : menus.filter(
        (menu) =>
          menu.category.id === selectedCategory,
      );

  const groupedMenus = React.useMemo(() => {
    const groups = new Map<number, Menu[]>();

    filteredMenus.forEach((menu) => {
      const categoryId = menu.category.id;

      if (!groups.has(categoryId)) {
        groups.set(categoryId, []);
      }

      groups.get(categoryId)!.push(menu);
    });

    return categories
      .map((category) => ({
        category,
        menus: groups.get(category.id) || [],
      }))
      .filter(
        (group) => group.menus.length > 0,
      );
  }, [categories, filteredMenus]);

  const addToCart = () => {

    if (!selectedMenu) {
      return;
    }

    if (!selectedMenu.qrOrderAvailable) {
      return;
    }

    setCart((prev) => {

      const existingItem =
        prev.find(
          (item) =>
            item.menu.id === selectedMenu.id &&
            item.notes === selectedNotes,
        );

      if (existingItem) {

        return prev.map((item) =>
          item.menu.id === selectedMenu.id &&
            item.notes === selectedNotes
            ? {
              ...item,
              quantity:
                item.quantity +
                selectedQuantity,
            }
            : item,
        );

      }

      return [
        ...prev,
        {
          menu: selectedMenu,
          quantity: selectedQuantity,
          notes: selectedNotes.trim(),
        },
      ];

    });

    setSelectedMenu(null);
    setSelectedNotes("");
    setSelectedQuantity(1);
  };

  const increaseQuantity = (
    index: number,
  ) => {

    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
            ...item,
            quantity:
              item.quantity + 1,
          }
          : item,
      ),
    );
  };

  const decreaseQuantity = (
    index: number,
  ) => {

    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
            : item,
        )
        .filter(
          (item) => item.quantity > 0,
        ),
    );
  };

  const placeOrder = async () => {
    if (!qrToken) {
      alert("QR token is missing.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        qrToken,
        items: cart.map((item) => ({
          menuId: item.menu.id,
          quantity: item.quantity,
          notes: item.notes || "",
        })),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order",
        );
      }

      setOrderId(data.orderId);
      await loadOrders();

      setOrderSuccess(true);

      setCart([]);

      setShowCart(false);

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to place order.",
      );

    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {

    return cart.reduce(
      (total, item) =>
        total +
        item.menu.price *
        item.quantity,
      0,
    );
  };

  const formatPrice = (
    price: number,
  ) => {

    return new Intl.NumberFormat(
      "id-ID",
    ).format(price);
  };
  const getLocalizedText = (
    value: string,
  ) => {
    const enMatch = value.match(
      /^EN\/(.*?)\/ID\/(.*)$/i,
    );

    if (!enMatch) {
      return value;
    }

    const english = enMatch[1].trim();
    const indonesian = enMatch[2].trim();

    return language === "EN"
      ? english
      : indonesian;
  };

  const openMenuDetail = (
    menu: Menu,
  ) => {

    if (!menu.qrOrderAvailable) {
      return;
    }

    setSelectedMenu(menu);
    setSelectedNotes("");
    setSelectedQuantity(1);
  };

  if (loading) {

    return (
      <div className="customerMenu__page">

        <div className="customerMenu__loading">
          Loading menu...
        </div>

      </div>
    );
  }

  return (
    <div className="customerMenu__page">

      {/* HEADER */}

      <header className="customerMenu__header">

        <div>
          <div className="customerMenu__brand">
            Old Klang House
          </div>

          <div className="customerMenu__subtitle">
            Bak Kut Teh
          </div>
        </div>

        <div className="customerMenu__headerActions">
          <div className="customerMenu__languageSwitch">

            <button
              className={
                language === "EN"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("EN")
              }
            >
              EN
            </button>

            <button
              className={
                language === "ID"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLanguage("ID")
              }
            >
              ID
            </button>

          </div>
          <button
            className="customerMenu__ordersButton"
            onClick={() => {
              loadOrders();
              setShowOrders(true);
            }}
          >
            Orders ({orders.length})
          </button>

          <button
            className="customerMenu__cartButton"
            onClick={() =>
              setShowCart(true)
            }
          >
            Place Order ({cart.length})
          </button>

        </div>

      </header>

      {/* CATEGORY */}

      <div className="customerMenu__categories">

        <button
          className={
            selectedCategory === "ALL"
              ? "active"
              : ""
          }
          onClick={() =>
            setSelectedCategory("ALL")
          }
        >
          All
        </button>

        {categories.map(
          (category) => (
            <button
              key={category.id}
              className={
                selectedCategory ===
                  category.id
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(
                  category.id,
                )
              }
            >
              {category.name}
            </button>
          ),
        )}

      </div>

      {/* MENU */}

      <main className="customerMenu__list">

        {selectedCategory === "ALL" ? (

          groupedMenus.map((group) => (

            <section
              key={group.category.id}
              className="customerMenu__categorySection"
            >

              <div className="customerMenu__categoryTitle">
                <h2>
                  {group.category.name}
                </h2>

                <span>
                  {group.menus.length}{" "}
                  {group.menus.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="customerMenu__categoryItems">

                {group.menus.map((menu) => {

                  const soldOut =
                    !menu.qrOrderAvailable;

                  return (
                    <div
                      key={menu.id}
                      className={`customerMenu__item ${soldOut
                          ? "soldOut"
                          : ""
                        }`}
                      onClick={() =>
                        openMenuDetail(menu)
                      }
                    >

                      <div className="customerMenu__itemContent">

                        <h2>
                          {getLocalizedText(
                            menu.name,
                          )}
                        </h2>

                        <p>
                          {getLocalizedText(
                            menu.description,
                          )}
                        </p>

                        <strong>
                          Rp{" "}
                          {formatPrice(
                            menu.price,
                          )}
                        </strong>

                      </div>

                      <div>

                        {soldOut ? (

                          <span className="customerMenu__soldOut">
                            SOLD OUT
                          </span>

                        ) : (

                          <button
                            className="customerMenu__addButton"
                            onClick={(e) => {
                              e.stopPropagation();

                              openMenuDetail(
                                menu,
                              );
                            }}
                          >
                            +
                          </button>

                        )}

                      </div>

                    </div>
                  );
                })}

              </div>

            </section>
          ))

        ) : (

          filteredMenus.map((menu) => {

            const soldOut =
              !menu.qrOrderAvailable;

            return (
              <div
                key={menu.id}
                className={`customerMenu__item ${soldOut
                    ? "soldOut"
                    : ""
                  }`}
                onClick={() =>
                  openMenuDetail(menu)
                }
              >

                <div className="customerMenu__itemContent">

                  <h2>
                    {getLocalizedText(
                      menu.name,
                    )}
                  </h2>

                  <p>
                    {getLocalizedText(
                      menu.description,
                    )}
                  </p>

                  <strong>
                    Rp{" "}
                    {formatPrice(
                      menu.price,
                    )}
                  </strong>

                </div>

                <div>

                  {soldOut ? (

                    <span className="customerMenu__soldOut">
                      SOLD OUT
                    </span>

                  ) : (

                    <button
                      className="customerMenu__addButton"
                      onClick={(e) => {
                        e.stopPropagation();

                        openMenuDetail(
                          menu,
                        );
                      }}
                    >
                      +
                    </button>

                  )}

                </div>

              </div>
            );
          })
        )}

      </main>

      {/* MENU DETAIL MODAL */}

      {selectedMenu && (

        <div
          className="customerMenu__overlay"
          onClick={() =>
            setSelectedMenu(null)
          }
        >

          <div
            className="customerMenu__modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="customerMenu__modalClose"
              onClick={() =>
                setSelectedMenu(null)
              }
            >
              ×
            </button>

            <h2>
              {getLocalizedText(selectedMenu.name)}
            </h2>

            <p>
              {getLocalizedText(
                selectedMenu.description,
              )}
            </p>

            <strong>
              Rp{" "}
              {formatPrice(
                selectedMenu.price,
              )}
            </strong>

            <div className="customerMenu__quantity">

              <button
                onClick={() =>
                  setSelectedQuantity(
                    Math.max(
                      1,
                      selectedQuantity - 1,
                    ),
                  )
                }
              >
                −
              </button>

              <span>
                {selectedQuantity}
              </span>

              <button
                onClick={() =>
                  setSelectedQuantity(
                    selectedQuantity + 1,
                  )
                }
              >
                +
              </button>

            </div>

            <textarea
              placeholder="Special request (optional)"
              value={selectedNotes}
              onChange={(e) =>
                setSelectedNotes(
                  e.target.value,
                )
              }
              maxLength={500}
            />

            <button
              className="customerMenu__confirmAdd"
              onClick={addToCart}
            >
              Add to Cart
            </button>

          </div>

        </div>

      )}

      {/* CART */}

      {showCart && (

        <div
          className="customerMenu__overlay"
          onClick={() =>
            setShowCart(false)
          }
        >

          <div
            className="customerMenu__cartModal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="customerMenu__cartHeader">

              <div>
                <span>
                  YOUR ORDER
                </span>

                <h2>
                  Table
                </h2>
              </div>

              <button
                className="customerMenu__modalClose"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ×
              </button>

            </div>

            {cart.length === 0 ? (

              <div className="customerMenu__emptyCart">
                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add some delicious food to get started.
                </p>
              </div>

            ) : (

              <>

                <div className="customerMenu__cartItems">

                  {cart.map(
                    (item, index) => (

                      <div
                        key={`${item.menu.id}-${index}`}
                        className="customerMenu__cartItem"
                      >

                        <div>

                          <h3>
                            {getLocalizedText(item.menu.name)}
                          </h3>

                          <span>
                            Rp{" "}
                            {formatPrice(
                              item.menu.price,
                            )}
                          </span>

                          {item.notes && (
                            <small>
                              Note:{" "}
                              {item.notes}
                            </small>
                          )}

                        </div>

                        <div className="customerMenu__cartQuantity">

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                index,
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(
                                index,
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                    ),
                  )}

                </div>

                <div className="customerMenu__cartFooter">

                  <div>
                    <span>
                      Total
                    </span>

                    <strong>
                      Rp{" "}
                      {formatPrice(
                        calculateTotal(),
                      )}
                    </strong>
                  </div>

                  <button
                    className="customerMenu__placeOrderButton"
                    onClick={placeOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder
                      ? "Sending Order..."
                      : "Place Order"}
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}
      {orderSuccess && (
        <div className="customerMenu__overlay">
          <div className="customerMenu__successModal">

            <div className="customerMenu__successIcon">
              ✓
            </div>

            <h2>
              Order Received
            </h2>

            <p>
              Your order has been sent to the restaurant.
            </p>

            <div className="customerMenu__orderNumber">
              Order #{orderId}
            </div>

            <button
              onClick={() =>
                setOrderSuccess(false)
              }
            >
              Continue Ordering
            </button>

          </div>
        </div>
      )}
      {showOrders && (

        <div
          className="customerMenu__overlay"
          onClick={() =>
            setShowOrders(false)
          }
        >

          <div
            className="customerMenu__ordersModal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="customerMenu__cartHeader">

              <div>
                <span>
                  YOUR ORDERS
                </span>

                <h2>
                  Table Orders
                </h2>
              </div>

              <button
                className="customerMenu__modalClose"
                onClick={() =>
                  setShowOrders(false)
                }
              >
                ×
              </button>

            </div>

            {ordersLoading ? (

              <div className="customerMenu__ordersEmpty">
                Loading orders...
              </div>

            ) : orders.length === 0 ? (

              <div className="customerMenu__ordersEmpty">
                <h3>
                  No Orders Yet
                </h3>

                <p>
                  Your orders will appear here.
                </p>
              </div>

            ) : (

              <div className="customerMenu__ordersList">

                {orders.map((order) => (

                  <div
                    key={order.orderId}
                    className="customerMenu__orderCard"
                  >

                    <div className="customerMenu__orderCardHeader">

                      <div>
                        <span>
                          ORDER #{order.orderId}
                        </span>

                        <h3>
                          Table {order.tableNumber}
                        </h3>
                      </div>

                      <span
                        className={`customerMenu__orderStatus ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>

                    </div>

                    <div className="customerMenu__orderItems">

                      {order.items.map(
                        (item) => (

                          <div
                            key={item.id}
                            className={`customerMenu__orderItem ${item.status === "CANCELLED"
                              ? "cancelled"
                              : ""
                              }`}
                          >

                            <div className="customerMenu__orderItemMain">

                              <span>
                                {item.quantity} ×{" "}
                                {getLocalizedText(item.menuName)}
                              </span>

                              {item.status === "CANCELLED" && (
                                <small className="customerMenu__itemCancelled">
                                  CANCELLED
                                </small>
                              )}

                            </div>

                            <strong
                              className={
                                item.status === "CANCELLED"
                                  ? "cancelled"
                                  : ""
                              }
                            >
                              Rp{" "}
                              {formatPrice(
                                item.subtotal,
                              )}
                            </strong>

                          </div>

                        ),
                      )}

                    </div>

                    <div className="customerMenu__orderTotal">

                      <span>
                        Total
                      </span>

                      <strong>
                        Rp{" "}
                        {formatPrice(
                          order.subtotal,
                        )}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      )}
    </div>
  );
};

export default CustomerMenu;