import type { Employee } from "../types/scheduleTypes"
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";

interface Props {
    employee: Employee
}

const EmployeeCard = ({ employee }: Props) => {
    const { mutate: deleteEmp } = useDeleteEmployee();

	const handleDelete = () => {
		if (confirm("Are you sure you want to delete this employee?")) {
			deleteEmp(employee.id);
		}
	};
    return (
        <div className="bg-white rounded shadow p-4 flex items-center gap-4">
            <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <p className="text-sm text-gray-400">{employee.Occupation}</p>
            </div>
            <button
				onClick={handleDelete}
				className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
			>
				Delete
			</button>
        </div>
    )
}

export default EmployeeCard