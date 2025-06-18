import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "./config/api-config.js";

function App() {
  const [users, setUsers] = useState([]);

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
        setUsers((prevState) => [
          ...prevState,
          {
            id: data.id,
            username: data.username,
            email: data.email,
          },
        ]);
        formElement.reset();
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
      >
        <h2>Add new user</h2>

        <label>
          Username
          <input type="text" name="username" autoComplete="username" required />
        </label>

        <label>
          Email
          <input type="email" name="email" autoComplete="email" required />
        </label>

        <button type="submit">Add</button>
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
