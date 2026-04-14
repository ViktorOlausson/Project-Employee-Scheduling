import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import EmployeeListPage from "./pages/EmployeeListPage"
import RegisterEmployeePage from "./pages/RegisterEmployeePage"
import JobSchedulePage from "./pages/JobSchedulePage"
import AvailabilityPage from "./pages/AvailabilityPage"
import MySchedulePage from "./pages/MySchedulePage"
import WorkSchedulePage from "./pages/WorkSchedulePage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employees" element={<><Navbar /><EmployeeListPage /></>} />
        <Route path="/employees/register" element={<><Navbar /><RegisterEmployeePage /></>} />
        <Route path="/schedule" element={<><Navbar /><JobSchedulePage /></>} />
        <Route path="/availability" element={<><Navbar /><AvailabilityPage /></>} />
        <Route path="/my-schedule" element={<><Navbar /><MySchedulePage /></>} />
        <Route path="/schedule/:employeeId" element={<><Navbar /><WorkSchedulePage /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App