"use client";
import React, { useState } from "react";
import Icon from "./icons/Icon";

const Search = () => {
  const [query, setQuery] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query
      )}`;
      window.location.href = searchUrl;
    }
  };

  return (
    <div className="flex items-center gap-4 w-full min-w-96 h-12 px-6 border rounded-3xl shadow-md">
      <Icon name="search" className="text-gray-500" />
      <input
        type="text"
        placeholder="Search Google"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full outline-none"
      />
    </div>
  );
};

export default Search;
