import { Route, Routes } from "react-router-dom";
import LoginButton from "./login";
const RouteComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginButton />}></Route>
      </Routes>
    </div>
  );
};

export default RouteComponent;
