import { Box, Input } from "@mantine/core";
import styles from "./register.module.css";
import { Link } from "react-router-dom";
const Register = () => (
  <Box className={styles["main-wrapper"]}>
    <Box className={styles["wrapper"]}>
      <form action="">
        <h1>Register</h1>
        <Box className={styles["input-box"]}>
          <Input type="text" placeholder="First Name" required />
        </Box>
        <Box className={styles["input-box"]}>
          <Input type="text" placeholder="Last Name" required />
        </Box>
        <Box className={styles["input-box"]}>
          <Input type="text" placeholder="Username" required />
        </Box>

        <Box className={styles["input-box"]}>
          <Input type="password" placeholder="Password" required />
        </Box>
        <Box className={styles["input-box"]}>
          <Input type="password" placeholder="Confirm Password" required />
        </Box>

        <button type="submit" className={styles["btn"]}>
          Submit
        </button>
        <Box className={styles["register-link"]}>
          <p>
            Already Have an account? <Link to={"/login"}>Go To Login</Link>
          </p>
        </Box>
      </form>
    </Box>
  </Box>
);

export default Register;
