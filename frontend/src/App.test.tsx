import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    logout: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe("App", () => {
  it("affiche le titre principal", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<App />}>
            <Route index element={<div>Accueil test</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /club poisson/i, level: 1 }),
    ).toBeInTheDocument();
  });
});
