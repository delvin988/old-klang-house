import React from "react";

import { useNavigate }
  from "react-router-dom";

import "./RestaurantBackofficeDashboard.css";

const BackofficeLogin = () => {

  const navigate =
    useNavigate();

  const [username, setUsername] =
    React.useState("");

  const [password, setPassword] =
    React.useState("");

  const [loading, setLoading] =
    React.useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "https://okhrestaurant-ca7148d529c4.herokuapp.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!res.ok) {

        alert(
          "Invalid credentials"
        );

        return;

      }

      const data =
        await res.json();

      localStorage.setItem(
        "token",
        data.token
      );

      navigate(
        "/backoffice/dashboard"
      );

    } catch (err) {

      console.error(err);

      alert("Login failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="backofficeLogin">

      <div className="backofficeLogin__card">

        <div className="backofficeLogin__header">

          <h1>
            Restaurant Backoffice
          </h1>

          <p>
            Sign in to manage
            reservations
          </p>

        </div>

        <div className="backofficeLogin__form">

          <div className="backofficeLogin__field">

            <label>
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />

          </div>

          <div className="backofficeLogin__field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="backofficeLogin__button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default BackofficeLogin;