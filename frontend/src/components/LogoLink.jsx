import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "@mantine/core";

/**
 * Animated QKart logo that links to the homepage.
 * Renders a teal glow on hover via Framer Motion.
 * Extracted from Header.jsx for reuse and single responsibility.
 */
const LogoLink = () => (
  <Box className="header-title">
    <Link to="/">
      <motion.img
        src="logo_dark.svg"
        alt="QKart logo"
        className="header-logo"
        whileHover={{ filter: "drop-shadow(0 0 10px #00a278)" }}
        transition={{ duration: 0.25 }}
      />
    </Link>
  </Box>
);

export default LogoLink;
