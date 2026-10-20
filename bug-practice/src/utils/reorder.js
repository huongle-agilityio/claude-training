// Returns a new array with the item at `fromIndex` moved to `toIndex`.
export const reorder = (list, fromIndex, toIndex) => {
  const isOutOfRange = (index) => index < 0 || index >= list.length;
  if (fromIndex === toIndex || isOutOfRange(fromIndex) || isOutOfRange(toIndex)) {
    return list;
  }

  const result = [...list];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
};
