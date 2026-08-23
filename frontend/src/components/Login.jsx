import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { toast as sonnerToast } from "sonner";
import { toast as toastifyToast } from "react-toastify";
import { TextInput, PasswordInput, Button, Stack, Text, Loader, Center } from "@mantine/core";
import Footer from "./Footer";
import Header from "./Header";
import useAuthStore from "../stores/authStore";
import { loginUser } from "../services/authService";
import { authContainerVariants, authFieldVariants } from "../utils/animationVariants";
import { createInputHandler } from "../utils/formUtils";
import "./Login.css";

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
  const username = data.username || data.email;
  if (!username) {
    toast.error("Username is a required field");
    return false;
  }
  if (!data.password) {
    toast.error("Password is a required field");
    return false;
  }
  return true;
};

// ─── Login component ─────────────────────────────────────────────────────
const Login = () => {
  const history = useHistory();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInput = createInputHandler(setFormData);

  const handleLogin = async () => {
    if (!validateInput(formData)) return;
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        password: formData.password,
      };
      const data = await loginUser(payload);
      const token = data.token || data.tokens?.access?.token;
      const username = data.username || data.user?.username || formData.username;
      const balance = data.balance ?? data.user?.walletMoney ?? 0;

      login(token, username, balance);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("balance", balance);

      setFormData({ username: "", password: "" });
      toast.success("Logged in successfully");
      history.push("/");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
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
              <h2 className="auth-title">Login</h2>
              <Text size="sm" className="auth-subtitle">Sign in to continue shopping</Text>
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
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </motion.div>

              <motion.div variants={authFieldVariants}>
                <PasswordInput
                  id="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                  placeholder="Enter a password"
                  size="md"
                  radius="md"
                  classNames={{ input: "auth-input", label: "auth-label" }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
                    onClick={handleLogin}
                    className="auth-submit-btn"
                  >
                    Login to QKart
                  </Button>
                )}
              </motion.div>

              <motion.div variants={authFieldVariants}>
                <Text size="sm" ta="center" className="auth-switch">
                  Don't have an account?{" "}
                  <Link to="/register" className="auth-link">Register Now</Link>
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

export default Login;
