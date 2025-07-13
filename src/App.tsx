import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import ComboCreator from "./pages/ComboCreator";
import ComboManagement from "./pages/ComboManagement";

function App() {
  return (
    <Router>
      <Sidebar />
      <main className="ml-64 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/combo-creator" element={<ComboCreator />} />
          <Route path="/combo-management" element={<ComboManagement />} />
          <Route path="*" element={<Navigate to="/combo-creator" replace />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
