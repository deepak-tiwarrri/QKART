import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ActionIcon, Avatar, Box, Button, Container, Group, Text } from "@mantine/core";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMantineColorScheme } from '@mantine/core';
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const userEmail = localStorage.getItem("email") || "profile";

  const routeToExplore = () => {
    history.push("/");
  }
  const routeToRegister = () => {
    history.push("/register");
  }

  const routeToLogin = () => {
    history.push("/login");
  }

  const logOut = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('balance');

    history.push('/login');
    window.location.reload();
  }

  const renderActions = () => (
    <Group gap="sm" wrap="nowrap" className="header-actions">
      <ActionIcon
        variant="outline"
        color={dark ? 'yellow' : 'blue'}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
      >
        {dark ? <LightModeIcon /> : <DarkModeIcon />}
      </ActionIcon>
      {localStorage.getItem("email") ? (
        <>
          <Avatar radius="xl" alt={userEmail} src="avatar.png" name={userEmail} />
          <Text className="username-text" size="sm" fw={500}>{userEmail}</Text>
          <Button variant="default" onClick={logOut}>Logout</Button>
        </>
      ) : (
        <>
          <Button variant="default" onClick={routeToLogin}>Login</Button>
          <Button variant="filled" color="blue" onClick={routeToRegister}>Register</Button>
        </>
      )}
    </Group>
  );

  if (hasHiddenAuthButtons) {
    return (
      <Box component="header" className="header">
        <Container size="xl" className="header-inner">
          <Box className="header-title">
            <Link to="/">
              <img src="logo_light.svg" alt="QKart logo" className="header-logo" />
            </Link>
          </Box>
          {children ? <Box className="header-center">{children}</Box> : null}
          <Group gap="sm" wrap="nowrap" className="header-actions">
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <LightModeIcon /> : <DarkModeIcon />}
            </ActionIcon>
            <Button
              className="explore-button"
              leftSection={<ArrowBackIcon fontSize="small" />}
              onClick={routeToExplore}
              variant="subtle"
            >
              Back to explore
            </Button>
          </Group>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="header" className="header">
      <Container size="xl" className="header-inner">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart logo" className="header-logo" />
          </Link>
        </Box>
        {children ? <Box className="header-center">{children}</Box> : null}
        {renderActions()}
      </Container>
    </Box>
  );
};

export default Header;
