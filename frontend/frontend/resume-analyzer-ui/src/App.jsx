import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Result from "./pages/Result";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadResume />} />
                <Route path="/result" element={<Result />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;