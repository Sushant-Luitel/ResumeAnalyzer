import { Box } from "@mantine/core";
import styles from "./login.module.css";
import { Link } from "react-router-dom";
const Login = () => (
  <Box className={styles["main-wrapper"]}>
    <Box className={styles["wrapper"]}>
      <form action="">
        <h1>Login</h1>
        <Box className={styles["input-box"]}>
          <input type="text" placeholder="Username" required />
        </Box>
        <Box className={styles["input-box"]}>
          <input type="password" placeholder="Password" required />
        </Box>

        <Box className={styles["remember-forgot"]}>
          <label>
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#">Forgot Password</a>
        </Box>
        <button type="submit" className={styles["btn"]}>
          Login
        </button>
        <Box className={styles["register-link"]}>
          <p>
            Dont have an account? <Link to={"/register"}>Register</Link>
          </p>
        </Box>
      </form>
    </Box>
  </Box>
);

export default Login;
