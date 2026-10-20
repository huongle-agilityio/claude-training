const FADE_IN_STAGGER_MS = 50;

export const SortableItem = ({
  item,
  index,
  itemRef,
  isDragging,
  isOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const className = [
    "sortable-item",
    isDragging && "dragging",
    isOver && "drag-over",
  ]
    .filter(Boolean)
    .join(" ");

  const handleDragStart = (event) => {
    // Firefox only starts a drag when some data is set
    event.dataTransfer?.setData("text/plain", item.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    onDragStart(item.id);
  };

  const handleDragOver = (event) => {
    // Required so the browser allows dropping on this element
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    onDragOver(item.id);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    onDrop(item.id);
  };

  return (
    <li
      ref={itemRef}
      className={className}
      style={{ animationDelay: `${index * FADE_IN_STAGGER_MS}ms` }}
      draggable
      aria-grabbed={isDragging}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <span className="drag-handle" aria-hidden="true">
        ⋮⋮
      </span>
      <div className="sortable-item-content">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </li>
  );
};
