import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { toast as sonnerToast } from "sonner";
import { toast as toastifyToast } from "react-toastify";
import { TextInput, PasswordInput, Button, Stack, Text, Loader, Center } from "@mantine/core";
import Footer from "./Footer";
import Header from "./Header";
import { registerUser } from "../services/authService";
import { authContainerVariants, authFieldVariants } from "../utils/animationVariants";
import { createInputHandler } from "../utils/formUtils";
import "./Login.css"; // shared auth page styles

const toast = {
  success: (msg) => {
    sonnerToast.success(msg);
    toastifyToast.success(msg);
  },
  error: (msg) => {
    sonnerToast.error(msg);
    toastifyToast.error(msg);
  },
  warning: (msg) => {
    sonnerToast.warning(msg);
    toastifyToast.warning(msg);
  },
};

// ─── Validation ──────────────────────────────────────────────────────────
const validateInput = (data) => {
  const { username, password, confirmPassword } = data;
  if (!username) {
    toast.error("Username is a required field");
    return false;
  }
  if (username.length < 6) {
    toast.warning("Username must be at least 6 characters in length");
    return false;
  }
  if (!password) {
    toast.error("Password is a required field");
    return false;
  }
  if (password.length < 6) {
    toast.warning("Password must be at least 6 characters in length");
    return false;
  }
  if (password !== confirmPassword) {
    toast.warning("Passwords do not match");
    return false;
  }
  return true;
};

// ─── Register component ───────────────────────────────────────────────────
const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInput = createInputHandler(setFormData);

  const handleRegister = async () => {
    if (!validateInput(formData)) return;
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
      };
      await registerUser(payload);

      toast.success("Account created successfully! Welcome to QKart 🎉");
      setFormData({ username: "", password: "", confirmPassword: "" });
      history.push("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header hasHiddenAuthButtons />
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />

        <div className="auth-content">
          <motion.div
            className="auth-card"
            variants={authContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Brand mark */}
            <motion.div variants={authFieldVariants} className="auth-brand">
              <div className="auth-brand-icon">Q</div>
              <Text size="xl" fw={700} className="auth-brand-name">QKart</Text>
            </motion.div>

            <motion.div variants={authFieldVariants}>
              <h2 className="auth-title">Register</h2>
              <Text size="sm" className="auth-subtitle">Join QKart and start shopping</Text>
            </motion.div>

            <Stack gap="md" mt="lg">
              <motion.div variants={authFieldVariants}>
                <TextInput
                  id="username"
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInput}
                  placeholder="Enter Username"
                  size="md"
                  radius="md"
                  classNames={{ input: "auth-input", label: "auth-label" }}
                />
              </motion.div>

              <motion.div variants={authFieldVariants}>
                <PasswordInput
                  id="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                  placeholder="Enter a password with minimum 6 characters"
                  size="md"
                  radius="md"
                  classNames={{ input: "auth-input", label: "auth-label" }}
                />
              </motion.div>

              <motion.div variants={authFieldVariants}>
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInput}
                  placeholder="Re-enter your password to confirm"
                  size="md"
                  radius="md"
                  classNames={{ input: "auth-input", label: "auth-label" }}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </motion.div>

              <motion.div variants={authFieldVariants}>
                {loading ? (
                  <Center h={46}>
                    <Loader size="sm" color="teal" />
                  </Center>
                ) : (
                  <Button
                    fullWidth
                    size="md"
                    radius="md"
                    color="teal"
                    onClick={handleRegister}
                    className="auth-submit-btn"
                  >
                    Register Now
                  </Button>
                )}
              </motion.div>

              <motion.div variants={authFieldVariants}>
                <Text size="sm" ta="center" className="auth-switch">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link">Login here</Link>
                </Text>
              </motion.div>
            </Stack>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
