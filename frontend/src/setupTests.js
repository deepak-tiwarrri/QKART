import "@testing-library/jest-dom";
import React from "react";
import { MantineProvider } from "@mantine/core";

// Mock window.matchMedia for JSDOM
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// Mock ResizeObserver for JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Automatically wrap RTL render with MantineProvider for tests
vi.mock("@testing-library/react", async (importOriginal) => {
  const actual = await importOriginal();
  const customRender = (ui, options) => {
    const Wrapper = ({ children }) => {
      const content = options?.wrapper ? React.createElement(options.wrapper, null, children) : children;
      return React.createElement(MantineProvider, { defaultColorScheme: "dark" }, content);
    };
    return actual.render(ui, { ...options, wrapper: Wrapper });
  };
  return {
    ...actual,
    render: customRender,
  };
});

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