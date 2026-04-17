import type { Employee } from "../types/scheduleTypes"

interface Props {
    employee: Employee
}

const EmployeeCard = ({ employee }: Props) => {
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
        </div>
    )
}

export default EmployeeCard