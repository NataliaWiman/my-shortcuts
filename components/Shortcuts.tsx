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
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string | null>(null);
  const [newBookmark, setNewBookmark] = useState({
    name: "",
    url: "",
    favicon: "",
    labels: [""],
  });

  // Load bookmarks from local storage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      const parsedBookmarks: Bookmark[] = JSON.parse(savedBookmarks).map(
        (bookmark: Bookmark) => ({
          ...bookmark,
          labels: bookmark.labels || [],
        })
      );
      setBookmarks(parsedBookmarks);
    }
    const lastViewMode = localStorage.getItem("viewMode");
    if (lastViewMode) {
      const currentViewMode = JSON.parse(lastViewMode);
      setViewMode(currentViewMode);
    }
  }, []);

  // Save bookmarks to local storage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    localStorage.setItem("viewMode", JSON.stringify(viewMode));
  }, [bookmarks, viewMode]);

  const getUniqueLabels = () => {
    const allLabels = bookmarks.flatMap((bookmark) => bookmark.labels);
    return Array.from(new Set(allLabels));
  };

  const openAddModal = () => {
    setNewBookmark({ name: "", url: "", favicon: "", labels: [] });
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

    const newBookmarkEdited: Bookmark = {
      id: editIndex !== null ? bookmarks[editIndex].id : Date.now(),
      name: newBookmark.name,
      url: newBookmark.url,
      favicon: newBookmark.favicon || defaultFaviconUrl,
      labels: newBookmark.labels || [],
    };

    if (editIndex !== null) {
      // Edit existing bookmark
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks[editIndex] = newBookmarkEdited;
      setBookmarks(updatedBookmarks);
    } else {
      // Add new bookmark
      setBookmarks([...bookmarks, newBookmarkEdited]);
    }

    setNewBookmark({ name: "", url: "", favicon: "", labels: [] });
    setEditIndex(null);
    setShowModal(false);
  };

  const deleteBookmark = (index: number) => {
    const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
    setBookmarks(updatedBookmarks);
  };

  const handleFilter = (label: string | null) => {
    setSelectedLabel(label);
    setViewMode(label);
  };

  const filteredBookmarks = !selectedLabel
    ? bookmarks
    : bookmarks.filter((bookmark) => bookmark.labels.includes(selectedLabel));

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
      {getUniqueLabels().length > 0 && (
        <div className="flex justify-center rounded-md mt-2 mb-4">
          <button
            onClick={() => handleFilter(null)}
            className={`mr-4 py-2 text-sm font-medium underline-offset-2 hover:underline ${
              !selectedLabel ? "underline" : ""
            }`}
          >
            show all
          </button>
          <div className="flex">
            {getUniqueLabels().map((label) => (
              <button
                key={label}
                onClick={() => handleFilter(label)}
                className={`px-4 py-2 text-sm font-medium border border-neutral-300 first:rounded-l-lg last:rounded-r-lg ${
                  selectedLabel === label
                    ? "bg-neutral-300"
                    : "bg-transparent hover:bg-neutral-100 hover:text-neutral-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      <ul className="flex flex-wrap">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={bookmarks.map((bookmark) => bookmark.id)}>
            {filteredBookmarks.map((bookmark, index) => (
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
          <label htmlFor="labels">
            <span className="font-semibold text-sm">
              Labels (comma-separated)
            </span>
            <input
              id="labels"
              type="text"
              placeholder="e.g., work, personal"
              value={newBookmark.labels ? newBookmark.labels.join(", ") : ""}
              onChange={(e) =>
                setNewBookmark({
                  ...newBookmark,
                  labels: e.target.value
                    .split(",")
                    .map((label) => label.trim()),
                })
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
