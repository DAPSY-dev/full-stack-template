import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "vitest-browser-react";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url, options) => {
        const method = options.method?.toUpperCase() || "GET";
        if (url === `${import.meta.env.VITE_API_BASE_URL}/users`) {
          if (method === "GET") {
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => [
                { id: "1", username: "user1", email: "user1@gmail.com" },
              ],
            });
          }
          if (method === "POST") {
            const newUser = JSON.parse(options.body);
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => ({
                id: "2",
                username: newUser.username,
                email: newUser.email,
              }),
            });
          }
        }
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => [],
        });
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("list users", async () => {
    const { getByText } = render(<App />);
    await expect.element(getByText("user1@gmail.com")).toBeInTheDocument();
  });

  test("add new user", async () => {
    const { getByText, getByLabelText, getByRole } = render(<App />);
    await getByLabelText("Username").fill("user2");
    await getByLabelText("Email").fill("user2@gmail.com");
    await getByRole("button", { name: "Add" }).click();
    await expect.element(getByText("user2@gmail.com")).toBeInTheDocument();
  });
});
