import "@testing-library/jest-dom";

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'setItem');
  vi.spyOn(Storage.prototype, 'getItem');
  vi.spyOn(Storage.prototype, 'removeItem');
  vi.spyOn(Storage.prototype, 'clear');
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});