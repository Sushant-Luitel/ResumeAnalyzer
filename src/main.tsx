import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MantineProvider } from "@mantine/core";
import AuthProvider from "./context/authContext.tsx";

createRoot(document.getElementById("root")!).render(
  <MantineProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </MantineProvider>
);
