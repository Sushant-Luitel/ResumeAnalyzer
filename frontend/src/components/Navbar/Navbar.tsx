import { Button } from "@mantine/core";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/authContext";
const Navbar = () => {
  const { logOut } = useAuth();
  return (
    <div className={styles["navbar"]}>
      <div className={styles["navbar-container"]}>
        <div className={styles["left"]}>
          <span className={styles["logo"]}>Resume Analyzer</span>
        </div>
        <div className={styles["right"]}>
          <ul className={styles["navbar-links"]}>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
          <Button size="md" className="btn" onClick={logOut}>
            LogOut
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
