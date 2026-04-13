import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import RegisterEmployeePage from "./pages/RegisterEmployeePage";
import JobSchedulePage from "./pages/JobSchedulePage";
import AvailabilityPage from "./pages/AvailabilityPage";
import MySchedulePage from "./pages/MySchedulePage";
import WorkSchedulePage from "./pages/WorkSchedulePage";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/employees" element={<EmployeeListPage />} />
				<Route
					path="/employees/register"
					element={<RegisterEmployeePage />}
				/>
				<Route path="/schedule" element={<JobSchedulePage />} />
				<Route path="/availability" element={<AvailabilityPage />} />
				<Route path="/my-schedule" element={<MySchedulePage />} />
				<Route
					path="/schedule/:employeeId"
					element={<WorkSchedulePage />}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
