import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./context/NotificationContext.jsx";

function App() {
  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  );
}

export default App;