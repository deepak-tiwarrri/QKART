/**
 * Shared Framer Motion animation variants.
 * Import these instead of redefining them in every component.
 */

/** Auth card container — spring entrance with staggered children */
export const authContainerVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
      staggerChildren: 0.07,
    },
  },
};

/** Each field inside the auth card */
export const authFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Product grid container — staggers product cards */
export const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

/** Individual product card */
export const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

/** Cart item — slides in from right, slides out to left */
export const cartItemVariants = {
  hidden: { opacity: 0, x: 30, height: 0 },
  visible: {
    opacity: 1,
    x: 0,
    height: "auto",
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: -30,
    height: 0,
    transition: { duration: 0.25 },
  },
};
