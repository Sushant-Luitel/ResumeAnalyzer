import { Box } from "@mantine/core";
import Navbar from "../components/Navbar/Navbar";
import ResumeUpload from "../components/ResumeUpload/ResumeUpload";
import styles from "./home.module.css";
const Home = () => {
  return (
    <Box className={styles["home"]}>
      <Navbar />

      <ResumeUpload />
    </Box>
  );
};

export default Home;
