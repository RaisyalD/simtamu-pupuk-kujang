import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/navbar";
import { SessionProvider, useSession, signOut } from "next-auth/react";

//Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

//Mock next-auth/react
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(),
    signOut: jest.fn(),
  };
});

//Mock localStorage and scroll behavior
beforeAll(() => {
  const localStorageMock = (function () {
    let store: Record<string, string> = {};

    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value.toString();
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
});

describe("Navbar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    //Mock scrollY and event listeners
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });

    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  const renderNavbar = () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>
    );
  };

  test("renders login button if not authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    renderNavbar();

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("renders user dropdown when authenticated as admin", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Admin User", role: "admin" },
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    localStorage.setItem("user", JSON.stringify({ name: "Admin User", role: "admin" }));

    renderNavbar();

    const userButton = screen.getByRole("button", { name: /admin user/i });
    expect(userButton).toBeInTheDocument();
 
    fireEvent.click(userButton);

    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  test("calls signOut on logout click", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Admin User", role: "admin" },
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    localStorage.setItem("user", JSON.stringify({ name: "Admin User", role: "admin" }));

    renderNavbar();

    const userButton = screen.getByRole("button", { name: /admin user/i });
    fireEvent.click(userButton);

    const logoutItem = screen.getByText(/logout/i);
    fireEvent.click(logoutItem);

    expect(signOut).toHaveBeenCalled();
  });

  test("changes navbar style on scroll", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    renderNavbar();

    // Simulasi scroll
    (window.scrollY as number) = 100;

    const scrollEvent = new Event("scroll");
    window.dispatchEvent(scrollEvent);

    // Cek apakah nav memiliki role dan class berubah
    const navbar = screen.getByRole("navigation");
    expect(navbar).toHaveClass("bg-white"); // Sesuaikan dengan class pada scroll
  });
});
