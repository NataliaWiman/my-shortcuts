"use client";
import { Bookmark } from "@/types";
import React, { useEffect, useState } from "react";
import ShortcutItem from "./ShortcutItem";
import Tile from "./Tile";
import Modal from "./Modal";

const Shortcuts = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newBookmark, setNewBookmark] = useState({ name: "", url: "" });

  // Load bookmarks from local storage on initial render
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to local storage whenever they are updated
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const openAddModal = () => {
    setNewBookmark({ name: "", url: "" });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    setNewBookmark(bookmarks[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const addOrEditBookmark = () => {
    if (!newBookmark.name || !newBookmark.url) return;

    const url = new URL(newBookmark.url);
    const faviconUrl = `${url.origin}/favicon.ico`;

    const newBookmarkWithFavicon: Bookmark = {
      ...newBookmark,
      favicon: faviconUrl,
    };

    if (editIndex !== null) {
      // Edit existing bookmark
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks[editIndex] = newBookmarkWithFavicon;
      setBookmarks(updatedBookmarks);
    } else {
      // Add new bookmark
      setBookmarks([...bookmarks, newBookmarkWithFavicon]);
    }

    setNewBookmark({ name: "", url: "" });
    setEditIndex(null);
    setShowModal(false);
  };

  const deleteBookmark = (index: number) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="w-full mx-auto py-4">
      <ul className="flex flex-wrap">
        {bookmarks.map((bookmark, index) => (
          <li key={index}>
            <ShortcutItem
              bookmark={bookmark}
              onEdit={() => openEditModal(index)}
              onDelete={() => deleteBookmark(index)}
            />
          </li>
        ))}
        <button onClick={openAddModal}>
          <Tile title="Add shortcut" isAddNew />
        </button>
      </ul>

      {/* Modal */}
      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title={editIndex !== null ? "Edit Shortcut" : "Add Shortcut"}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addOrEditBookmark();
          }}
        >
          <label htmlFor="name">
            <span className="font-semibold text-sm">Name</span>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={newBookmark.name}
              required
              onChange={(e) =>
                setNewBookmark({ ...newBookmark, name: e.target.value })
              }
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
          </label>
          <label htmlFor="url">
            <span className="font-semibold text-sm">URL</span>
            <input
              name="url"
              type="url"
              placeholder="http://"
              value={newBookmark.url}
              required
              onChange={(e) =>
                setNewBookmark({ ...newBookmark, url: e.target.value })
              }
              className="block w-full mb-4 p-2 border border-gray-300 rounded"
            />
          </label>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mr-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {editIndex !== null ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Shortcuts;
