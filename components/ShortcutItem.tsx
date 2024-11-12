"use client";

import { Bookmark } from "@/types";
import React, { useRef, useState } from "react";
import Tile from "./Tile";
import Icon from "./icons/Icon";
import useOnClickOutside from "@/utils/useClickOutside";

type ShortcutItemProps = {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
};

const ShortcutItem = ({ bookmark, onEdit, onDelete }: ShortcutItemProps) => {
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  useOnClickOutside(menuRef, handleCloseMenu);

  return (
    <div className="relative group">
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        <Tile title={bookmark.name || ""} favicon={bookmark.favicon || ""} />
      </a>

      <div className="opacity-0 group-hover:opacity-70">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-1 right-1 h-7 w-7 px-1 py-0.5 rounded-full opacity-70 hover:opacity-100 hover:bg-neutral-300 focus:outline-none"
        >
          <Icon name="menu" className="w-5" />
        </button>
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-0 right-0 mt-2 bg-white border rounded shadow-lg z-10"
        >
          <button
            onClick={() => {
              onEdit();
              setShowMenu(false);
            }}
            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          >
            Edit shortcut
          </button>
          <button
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
            className="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortcutItem;
