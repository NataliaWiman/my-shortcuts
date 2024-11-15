"use client";

import { useState, useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        alert("Incorrect password.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/check-auth");
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(true);
        console.error("An error occurred while checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  if (!isAuthenticated) {
    return isLoading ? (
      <div
        role="status"
        className="fixed top-0 left-0 w-screen h-screen animate-pulse bg-neutral-300"
      ></div>
    ) : (
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="rounded-l-xl border border-gray-300 focus:border-gray-500 py-4 px-5 outline-none"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white rounded-r-xl py-4 px-5 border border-sky-600"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
