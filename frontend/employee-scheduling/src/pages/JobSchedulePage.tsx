import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "../services/api"
import { days, shifts } from "../constants/availabilityConstants"
import type { ScheduleEntry, Employee, Availability } from "../types/scheduleTypes"
import { useSchedule, useAssignShift, useRemoveShift } from "../hooks/useSchedule"

const getOccupationColor = (occupation: string) => {
    switch (occupation) {
        case "RUNNER": return "bg-green-100 text-green-800"
        case "WAITER": return "bg-yellow-100 text-yellow-800"
        case "DISHWASHER": return "bg-red-100 text-red-800"
        case "CHEF": return "bg-purple-100 text-purple-800"
        default: return "bg-blue-100 text-blue-800"
    }
}

const JobSchedulePage = () => {
    const navigate = useNavigate()

    const { data: schedule = [], isLoading } = useSchedule()
    const { data: employees = [] } = useQuery<Employee[]>({
        queryKey: ["employees"],
        queryFn: () => api.get("/users/employees/all").then(res => res.data)
    })
    const { data: availability = [] } = useQuery<Availability[]>({
        queryKey: ["availability"],
        queryFn: () => api.get("/availability").then(res => res.data)
    })

    const { mutate: assignShift } = useAssignShift()
    const { mutate: removeShift } = useRemoveShift()

    const getAssigned = (day: string, shift: string) => {
        return schedule.filter((entry: ScheduleEntry) => {
            const entryDay = (new Date(entry.date).getDay() + 6) % 7
            const dayIndex = days.indexOf(day)
            return entryDay === dayIndex && entry.shift === shift
        })
    }

    const isAvailable = (employeeId: number, day: string, shift: string) => {
        return availability.some((entry: Availability) =>
            entry.userId === employeeId &&
            entry.dayOfWeek === day &&
            entry.shift === shift
        )
    }

    const handleAssign = (employeeId: number, day: string, shift: string) => {
        const alreadyWorkingThatDay = shifts.some(s =>
            getAssigned(day, s).some((entry: ScheduleEntry) => entry.userId === employeeId)
        )
        if (alreadyWorkingThatDay) return

        const date = new Date()
        const dayIndex = days.indexOf(day)
        date.setDate(date.getDate() - date.getDay() + dayIndex + 1)

        assignShift({ userId: employeeId, date: date.toISOString(), shift })
    }

    if (isLoading) return <p className="p-8">Loading...</p>

    return (
        <div className="p-8">
            <button
                onClick={() => navigate("/employees")}
                className="text-gray-500 hover:underline text-sm cursor-pointer mb-4 block"
            >
                ← Back
            </button>
            <h1 className="text-2xl font-bold mb-6">Job Schedule</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left p-2"></th>
                        {days.map(day => (
                            <th key={day} className="p-2 text-sm font-medium">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {shifts.map(shift => (
                        <tr key={shift} className="border-t">
                            <td className="p-2 text-sm font-medium w-36">
                                {shift.charAt(0) + shift.slice(1).toLowerCase()} shift
                            </td>
                            {days.map(day => (
                                <td key={day} className="p-2 text-center border">
                                    <div className="flex flex-col gap-1">
                                        {getAssigned(day, shift).map((entry: ScheduleEntry) => (
                                            <div key={entry.id} className={`flex items-center justify-between text-xs px-2 py-1 rounded ${getOccupationColor(entry.user.Occupation)}`}>
                                                <span>{entry.user.firstName}</span>
                                                <button
                                                    onClick={() => removeShift({ userId: entry.userId, date: entry.date, shift: entry.shift })}
                                                    className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleAssign(parseInt(e.target.value), day, shift)
                                                    e.target.value = ""
                                                }
                                            }}
                                            className="text-xs border rounded px-1 py-1 cursor-pointer"
                                        >
                                            <option value="">+ Add</option>
                                            <optgroup label="Available">
                                                {employees
                                                    .filter((emp: Employee) =>
                                                        isAvailable(emp.id, day, shift) &&
                                                        !shifts.some(s => getAssigned(day, s).some((entry: ScheduleEntry) => entry.userId === emp.id))
                                                    )
                                                    .map((emp: Employee) => (
                                                        <option key={emp.id} value={emp.id}>
                                                            🟢 {emp.firstName} {emp.lastName}
                                                        </option>
                                                    ))}
                                            </optgroup>
                                            <optgroup label="Others">
                                                {employees
                                                    .filter((emp: Employee) =>
                                                        !isAvailable(emp.id, day, shift) &&
                                                        !shifts.some(s => getAssigned(day, s).some((entry: ScheduleEntry) => entry.userId === emp.id))
                                                    )
                                                    .map((emp: Employee) => (
                                                        <option key={emp.id} value={emp.id}>
                                                            {emp.firstName} {emp.lastName}
                                                        </option>
                                                    ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default JobSchedulePage