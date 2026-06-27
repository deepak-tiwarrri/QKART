import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData((nextFormData) => ({
      ...nextFormData,
      [key]: value,
    }));
  };
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    if (!validateInput(formData)) return;
    try {
      setLoading(true);
      const payload = {
        email: formData.email,
        password: formData.password,
      };
      if (!formData.name) {
        //if name is not present take email as name
        payload.name = formData.email;
      } else {
        payload.name = formData.name;
      }
      
      const response = await axios.post(`${config.endpoint}/auth/register`, payload);
      console.log("response from the register: ", response);
      
      // Backend returns 200 OK with message for duplicates (or other 200-level errors)
      if (response.data && response.data.message) {
        setLoading(false);
        toast.error(response.data.message);
        return;
      }
      
      setLoading(false);
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
      toast.success("Registered Successfully");
      //history
      history.push("/login");
    } catch (e) {
      console.log('error from register: ', e);
      setLoading(false);
      if (e.response && (e.response.status === 400 || e.response.status === 200)) {
        toast.error(e.response.data.message);
      } else {
        toast.error(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ email: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const { email, password, confirmPassword } = data;
    if (!email) {
      toast.warn("email is required field");
      return false;
    }
    if (!password) {
      toast.warn("password is required field");
      return false;
    }
    if (email.length < 6) {
      toast.warn("email must be at least 6 characters");
      return false;
    }

    if (password.length < 6) {
      toast.warn("password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return false;
    }
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            title="Email"
            name="email"
            value={formData.email}
            onChange={handleInput}
            placeholder="Enter Email.."
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInput}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInput}
            type="password"
            fullWidth
          />

          {/* Loading animation */}

          {loading ? (
            <Box display="flex" justifyContent="end">
              <CircularProgress size={25} color="primary" />
            </Box>
          ) : (
            <Button
              onClick={() => register(formData)}
              className="button"
              variant="contained"
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
