"use client";
import React, { useState, useEffect } from "react";
import Icon from "./icons/Icon";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchGoogleSuggestions = async (query: string) => {
    try {
      const response = await fetch("/api/google-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      fetchGoogleSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
      window.location.href = searchUrl;
    }
  };

  return (
    <div className="relative flex flex-col w-full min-w-96 z-10">
      <div className="flex items-center gap-4 w-full h-12 px-6 border rounded-3xl shadow-md">
        <Icon name="search" className="text-gray-500" />
        <input
          type="text"
          placeholder="Search Google"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full outline-none"
          autoFocus
        />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md mt-2 max-h-64 overflow-y-hidden">
          <ul className="h-full max-h-64 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  setSuggestions([]);
                  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
                    suggestion
                  )}`;
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
