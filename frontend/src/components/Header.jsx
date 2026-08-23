import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Group,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import useCartStore from "../stores/cartStore";
import LogoLink from "./LogoLink";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { email, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + (i.qty || 0), 0);

  // Scroll-aware shadow
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logOut = () => {
    logout();
    history.push("/login");
  };

  const ThemeToggle = () => (
    <ActionIcon
      variant="subtle"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="lg"
      radius="xl"
      className="theme-toggle"
    >
      {dark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </ActionIcon>
  );

  const renderActions = () => (
    <Group gap="sm" wrap="nowrap" className="header-actions">
      <ThemeToggle />

      {/* Cart badge — visible for logged-in users with items in cart */}
      {email && cartCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Badge circle size="lg" color="teal" variant="filled" className="cart-badge">
            {cartCount}
          </Badge>
        </motion.div>
      )}

      {email ? (
        <>
          <Avatar radius="xl" size="sm" alt={email} src={null} name={email} color="teal" />
          <Text className="username-text" size="sm" fw={500}>{email}</Text>
          <Button variant="subtle" color="gray" radius="xl" onClick={logOut} size="sm">
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="subtle" color="gray" radius="xl" onClick={() => history.push("/login")} size="sm">
            Login
          </Button>
          <Button variant="filled" color="teal" radius="xl" onClick={() => history.push("/register")} size="sm">
            Register
          </Button>
        </>
      )}
    </Group>
  );

  if (hasHiddenAuthButtons) {
    return (
      <Box component="header" className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <Container size="xl" className="header-inner">
          <LogoLink />
          {children && <Box className="header-center">{children}</Box>}
          <Group gap="sm" wrap="nowrap" className="header-actions">
            <ThemeToggle />
            <Button
              className="explore-button"
              leftSection={<ArrowBackIcon fontSize="small" />}
              onClick={() => history.push("/")}
              variant="subtle"
              color="teal"
              radius="xl"
            >
              Back to explore
            </Button>
          </Group>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="header" className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <Container size="xl" className="header-inner">
        <LogoLink />
        {children && <Box className="header-center">{children}</Box>}
        {renderActions()}
      </Container>
    </Box>
  );
};

export default Header;
