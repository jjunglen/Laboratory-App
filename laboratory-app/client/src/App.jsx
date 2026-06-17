import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./utils/ProtectedRoute";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin"

function App() {
  

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />

            <Route path="/auth" element={<Auth />}/>

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            
            }/>
            
            <Route path="/search" element={
              <ProtectedRoute>
                <Search/>
              </ProtectedRoute>
            
            }/>

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            
            }/>

            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            
            }/>

          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
