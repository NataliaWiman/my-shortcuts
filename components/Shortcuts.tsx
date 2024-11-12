"use client";
import { Bookmark } from "@/types";
import React, { useEffect, useState } from "react";
import ShortcutItem from "./ShortcutItem";
import Tile from "./Tile";
import Modal from "./Modal";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

const Shortcuts = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newBookmark, setNewBookmark] = useState({
    name: "",
    url: "",
    favicon: "",
  });

  // Load bookmarks from local storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save bookmarks to local storage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const openAddModal = () => {
    setNewBookmark({ name: "", url: "", favicon: "" });
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
    const defaultFaviconUrl = `${url.origin}/favicon.ico`;

    const newBookmarkWithFavicon: Bookmark = {
      id: editIndex !== null ? bookmarks[editIndex].id : Date.now(),
      name: newBookmark.name,
      url: newBookmark.url,
      favicon: newBookmark.favicon || defaultFaviconUrl,
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

    setNewBookmark({ name: "", url: "", favicon: "" });
    setEditIndex(null);
    setShowModal(false);
  };

  const deleteBookmark = (index: number) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
  };

  // DnD Kit configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.1,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = bookmarks.findIndex(
        (bookmark) => bookmark.id === active.id
      );
      const newIndex = bookmarks.findIndex(
        (bookmark) => bookmark.id === over.id
      );
      setBookmarks((bookmarks) => arrayMove(bookmarks, oldIndex, newIndex));
    }
  };

  return (
    <div className="w-full mx-auto py-4">
      <ul className="flex flex-wrap">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={bookmarks.map((bookmark) => bookmark.id)}>
            {bookmarks.map((bookmark, index) => (
              <ShortcutItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={() => openEditModal(index)}
                onDelete={() => deleteBookmark(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
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
          {editIndex !== null && (
            <label htmlFor="favicon">
              <span className="font-semibold text-sm">Favicon URL</span>
              <input
                id="favicon"
                type="url"
                placeholder="Favicon URL"
                value={newBookmark.favicon || ""}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, favicon: e.target.value })
                }
                className="block w-full mb-4 p-2 border border-gray-300 rounded"
              />
            </label>
          )}

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
