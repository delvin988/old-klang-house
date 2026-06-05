import React from "react";

import "./MenuManagement.css";
import "../RestaurantBackofficeDashboard.css";

import BackofficeSidebar from "../component/backOfficeSidebar";

import { useNavigate } from "react-router-dom";

type Menu = {
  id: number;

  name: string;

  description: string;

  category: {
    id: number;

    name: string;
  };

  price: number;

  active: boolean;
  todaySpecial: boolean;
};
type Category = {
  id: number;

  name: string;

  active: boolean;
};

const MenuManagement = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [menus, setMenus] = React.useState<Menu[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const [sortField, setSortField] = React.useState<string>("id");

  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc",
  );
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [showModal, setShowModal] = React.useState(false);

  const [editingMenu, setEditingMenu] = React.useState<Menu | null>(null);
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);

  const [categoryName, setCategoryName] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    todaySpecial: "false",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/backoffice");
  };
  const ITEMS_PER_PAGE = 5;
  React.useEffect(() => {
    loadMenus();
    loadCategories();
  }, []);

  const loadMenus = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/menus", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setMenus(data);
  };

  const openAddModal = () => {
    setEditingMenu(null);

    setFormData({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      todaySpecial: "false",
    });

    setShowModal(true);
  };

  const openEditModal = (menu: Menu) => {
    setEditingMenu(menu);

    setFormData({
      name: menu.name,
      description: menu.description,
      categoryId: menu.category.id.toString(),
      price: menu.price.toString(),
      todaySpecial: menu.todaySpecial.toString(),
    });

    setShowModal(true);
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const loadCategories = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/menu-categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setCategories(data);
  };
  const isValidBilingualFormat = (value: string) => {
    const regex = /^EN\/.+\/ID\/.+$/;

    return regex.test(value.trim());
  };
  const saveMenu = async () => {
    if (!isValidBilingualFormat(formData.name)) {
      alert(
        "Menu Name harus menggunakan format EN/English Name/ID/Nama Indonesia",
      );

      return;
    }

    if (!isValidBilingualFormat(formData.description)) {
      alert(
        "Description harus menggunakan format EN/English Description/ID/Deskripsi Indonesia",
      );

      return;
    }
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,

      description: formData.description,

      categoryId: Number(formData.categoryId),

      price: Number(formData.price),

      active: true,
      todaySpecial: formData.todaySpecial === "true",
    };

    if (editingMenu) {
      await fetch(`https://okhrestaurant-c9203e24f066.herokuapp.com/api/menus/${editingMenu.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });
    } else {
      await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/menus", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(payload),
      });
    }

    setShowModal(false);

    loadMenus();
  };

  const toggleStatus = async (menu: Menu) => {
    const token = localStorage.getItem("token");

    await fetch(`https://okhrestaurant-c9203e24f066.herokuapp.com/api/menus/${menu.id}/status`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        active: !menu.active,
      }),
    });

    loadMenus();
  };

  const deleteMenu = async (id: number) => {
    if (!window.confirm("Delete this menu?")) {
      return;
    }

    const token = localStorage.getItem("token");

    await fetch(`https://okhrestaurant-c9203e24f066.herokuapp.com/api/menus/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadMenus();
  };
  const openCategoryModal = () => {
    setCategoryName("");

    setShowCategoryModal(true);
  };
  const saveCategory = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("https://okhrestaurant-c9203e24f066.herokuapp.com/api/menu-categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: categoryName,
        active: true,
      }),
    });

    if (!res.ok) {
      alert("Category already exists");
      return;
    }

    await loadCategories();

    setShowCategoryModal(false);
  };
  const sortedMenus = [...menus].sort((a: any, b: any) => {
    let aValue;
    let bValue;

    switch (sortField) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;

      case "category":
        aValue = a.category?.name;
        bValue = b.category?.name;
        break;

      case "price":
        aValue = a.price;
        bValue = b.price;
        break;

      case "status":
        aValue = a.active;
        bValue = b.active;
        break;

      default:
        aValue = a.id;
        bValue = b.id;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;

    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;

    return 0;
  });

  const totalPages = Math.ceil(sortedMenus.length / ITEMS_PER_PAGE);

  const pagedMenus = sortedMenus.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  return (
    <div className="backofficeLayout">
      <BackofficeSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="backoffice__container">
        <button
          className="mobileMenuButton"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="backoffice__header">
          <h1>Menu Management</h1>

          <p>Manage restaurant menu items</p>
        </div>

        <div className="menuManagement__toolbar">
          <button className="menuManagement__addButton" onClick={openAddModal}>
            + Add Menu
          </button>
          <button
            className="menuManagement__categoryButton"
            onClick={openCategoryModal}
          >
            + Add Category
          </button>
        </div>

        <div className="backoffice__tableWrapper">
          <table className="backoffice__table">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                >
                  Name ↑↓
                </th>

                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("category")}
                >
                  Category ↑↓
                </th>

                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("price")}
                >
                  Price ↑↓
                </th>

                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("status")}
                >
                  Status ↑↓
                </th>

                <th>Today's Special</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="backoffice__empty">
                    <div className="backoffice__emptyContent">
                      <h3>No Menu Found</h3>

                      <p>Start by creating your first menu item.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pagedMenus.map((menu) => (
                  <tr key={menu.id}>
                    <td>{menu.name}</td>

                    <td>{menu.category?.name}</td>

                    <td>Rp {menu.price}</td>

                    <td>
                      <span
                        className={`menuManagement__status ${
                          menu.active ? "active" : "inactive"
                        }`}
                      >
                        {menu.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{menu.todaySpecial ? "Yes" : "No"}</td>
                    <td>
                      <div className="backoffice__actions">
                        <button onClick={() => openEditModal(menu)}>
                          Edit
                        </button>

                        <button onClick={() => toggleStatus(menu)}>
                          {menu.active ? "Disable" : "Enable"}
                        </button>

                        <button
                          className="cancel"
                          onClick={() => deleteMenu(menu.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="reservation__pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {showModal && (
          <div className="menuManagement__modal">
            <form
              className="menuManagement__modalCard"
              onSubmit={(e) => {
                e.preventDefault();
                saveMenu();
              }}
            >
              <h2>{editingMenu ? "Edit Menu" : "Add Menu"}</h2>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#5A4632",
                }}
              >
                Menu Name
              </label>
              <input
                required
                placeholder="Menu Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#5A4632",
                }}
              >
                Description
              </label>
              <textarea
                required
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#5A4632",
                }}
              >
                Category
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>

                {categories
                  .filter((category) => category.active)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#5A4632",
                }}
              >
                Price
              </label>
              <input
                required
                type="number"
                min="1"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value,
                  })
                }
              />
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#5A4632",
                }}
              >
                Today Special
              </label>
              <select
                value={formData.todaySpecial}
                onChange={(e) => {
                  const selectedCategory = categories.find(
                    (c) => c.id.toString() === formData.categoryId,
                  );

                  const allowed =
                    selectedCategory?.name === "Today special makanan" ||
                    selectedCategory?.name === "Today special minuman";

                  if (e.target.value === "true" && !allowed) {
                    alert(
                      "Today's Special hanya dapat digunakan untuk kategori Today special makanan atau Today special minuman",
                    );

                    return;
                  }

                  setFormData({
                    ...formData,
                    todaySpecial: e.target.value,
                  });
                }}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
              <div className="menuManagement__modalActions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button type="submit" className="save">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
        {showCategoryModal && (
          <div className="menuManagement__modal">
            <form
              className="menuManagement__modalCard"
              onSubmit={(e) => {
                e.preventDefault();
                saveCategory();
              }}
            >
              <h2>Add Category</h2>

              <input
                required
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />

              <div className="menuManagement__modalActions">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
