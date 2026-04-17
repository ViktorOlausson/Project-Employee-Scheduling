import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import EmployeeListPage from "./pages/EmployeeListPage"
import RegisterEmployeePage from "./pages/RegisterEmployeePage"
import JobSchedulePage from "./pages/JobSchedulePage"
import AvailabilityPage from "./pages/AvailabilityPage"
import MySchedulePage from "./pages/MySchedulePage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/employees" element={
          <ProtectedRoute allowedRole="EMPLOYER">
            <Navbar /><EmployeeListPage />
          </ProtectedRoute>
        } />
        <Route path="/employees/register" element={
          <ProtectedRoute allowedRole="EMPLOYER">
            <Navbar /><RegisterEmployeePage />
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute allowedRole="EMPLOYER">
            <Navbar /><JobSchedulePage />
          </ProtectedRoute>
        } />

        <Route path="/availability" element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <Navbar /><AvailabilityPage />
          </ProtectedRoute>
        } />
        <Route path="/my-schedule" element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <Navbar /><MySchedulePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App