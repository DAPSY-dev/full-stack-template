import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "./config/api-config.js";

const ERRORS = {
  REQUIRED: "This field is required.",
  INVALID_EMAIL: "The email address is invalid.",
};

function App() {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(API_ENDPOINTS.users, { signal })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    fetch(formElement.getAttribute("action"), {
      method: formElement.getAttribute("method"),
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get("username"),
        email: formData.get("email"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrors(data.error.fields);
        } else {
          setErrors({});
          setUsers((prevState) => [
            ...prevState,
            {
              id: data.id,
              username: data.username,
              email: data.email,
            },
          ]);
          formElement.reset();
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <h1>Users</h1>

      <form
        action={API_ENDPOINTS.users}
        method="POST"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <fieldset>
          <legend>New user</legend>

          <label>
            Username
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
            />
            {errors.username && <small>{ERRORS[errors.username]}</small>}
          </label>

          <label>
            Email
            <input type="email" name="email" autoComplete="email" required />
            {errors.email && <small>{ERRORS[errors.email]}</small>}
          </label>

          <button type="submit">Add</button>
        </fieldset>
      </form>

      {users.length > 0 && (
        <>
          <h2>All users</h2>

          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong> ({user.email})
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default App;
