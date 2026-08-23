/**
 * Debounce utility.
 *
 * Creates a debounced version of any callback — prevents it from firing
 * until `delay` milliseconds have passed since the last invocation.
 *
 * Usage in a component:
 *   const debouncedSearch = useMemo(() => createDebounce(performSearch, 500), []);
 *   <input onChange={(e) => debouncedSearch(e.target.value)} />
 *
 * NOTE: The previous constant.js version was broken — it referenced
 * `timerId` and `performSearch` from the outer scope that didn't exist.
 * This factory pattern is the correct approach.
 *
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export const createDebounce = (callback, delay) => {
  let timerId;
  return (value) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => callback(value), delay);
  };
};