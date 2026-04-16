import { useNavigate } from "react-router-dom"
import { useEmployees } from "../hooks/useEmployees"
import EmployeeCard from "../components/EmployeeCard"

const EmployeeListPage = () => {
    const { data: employees = [], isLoading, isError } = useEmployees()
    const navigate = useNavigate()

    if (isLoading) return <p className="p-8">Loading...</p>
    if (isError) return <p className="p-8 text-red-500">Could not fetch employees</p>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Employees</h1>
                <button
                    onClick={() => navigate("/employees/register")}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer"
                >
                    Register new employee
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {employees.map((emp: any) => (
                    <EmployeeCard key={emp.id} employee={emp} />
                ))}
            </div>
        </div>
    )
}

export default EmployeeListPage