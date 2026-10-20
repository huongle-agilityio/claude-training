import { useState } from "react";
import { SortableItem } from "./SortableItem";
import { reorder } from "../utils/reorder";
import { useFlipAnimation } from "../hooks/useFlipAnimation";
import "./SortableList.css";

const indexOfId = (list, id) => list.findIndex((item) => item.id === id);

export const SortableList = ({ initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [draggedId, setDraggedId] = useState(null);
  const [overId, setOverId] = useState(null);
  const registerItem = useFlipAnimation(items);

  const resetDrag = () => {
    setDraggedId(null);
    setOverId(null);
  };

  const handleDragOver = (id) => {
    if (id !== draggedId) setOverId(id);
  };

  const handleDrop = (targetId) => {
    if (draggedId && draggedId !== targetId) {
      setItems((prev) =>
        reorder(prev, indexOfId(prev, draggedId), indexOfId(prev, targetId)),
      );
    }
    resetDrag();
  };

  return (
    <ul className="sortable-list">
      {items.map((item, index) => (
        <SortableItem
          key={item.id}
          item={item}
          index={index}
          itemRef={registerItem(item.id)}
          isDragging={item.id === draggedId}
          isOver={item.id === overId}
          onDragStart={setDraggedId}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={resetDrag}
        />
      ))}
    </ul>
  );
};
