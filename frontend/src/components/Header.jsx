import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
 
  
  const routeToExplore=()=>{
    history.push("/");
  }
  const routeToRegister = ()=>{
    history.push("/register");
  }

  const routeToLogin = ()=>{
    history.push("/login");
  }
  
  const logOut=()=>{
    //clear the data
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('balance');

    //redirect to login page
    history.push('/login');
    window.location.reload();
  }

  if(hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
        <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
        </Box>
        {children}
        <Stack direction="row" spacing={1} alignItems="center">
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
            startIcon={<ArrowBackIcon />} onClick={routeToExplore}
            variant="text"
          >
            Back to explore
          </Button>
        </Stack>
      </Box>
    );
  }
    return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
        </Box>
        {children}
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionIcon
            variant="outline"
            color={dark ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <LightModeIcon /> : <DarkModeIcon />}
          </ActionIcon>
          {localStorage.getItem("email")?(
            <>
            <Avatar src="avatar.png" alt={localStorage.getItem("email") || "profile"}/>
            <p className="username-text">{localStorage.getItem("email")}</p>
            <Button type="primary" onClick={logOut}>Logout</Button>
            </>
          ):(
            <>
            <Button onClick={routeToLogin}>Login</Button>
            <Button onClick={routeToRegister} variant="contained">Register</Button>
            </>
          )}
        </Stack>
      </Box>
    );
};

export default Header;
