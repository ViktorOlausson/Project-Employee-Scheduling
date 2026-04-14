import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const shifts = ["MORNING", "AFTERNOON", "NIGHT"]

interface ScheduleEntry {
    id: number
    userId: number
    date: string
    shift: string
    user: {
        id: number
        firstName: string
        lastName: string
        Occupation: string
    }
}

interface Employee {
    id: number
    firstName: string
    lastName: string
    Occupation: string
}

const JobSchedulePage = () => {
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleRes, employeesRes] = await Promise.all([
                    api.get("/schedule"),
                    api.get("/users/employees/all")
                ])
                setSchedule(scheduleRes.data)
                setEmployees(employeesRes.data)
            } catch (err) {
                console.error("Could not fetch data", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const assignShift = async (employeeId: number, day: string, shift: string) => {
        try {
            // Kolla om personen redan jobbar den dagen
            const alreadyWorkingThatDay = shifts.some(s =>
                getAssigned(day, s).some(entry => entry.userId === employeeId)
            )
            if (alreadyWorkingThatDay) return

            const date = new Date()
            const dayIndex = days.indexOf(day)
            date.setDate(date.getDate() - date.getDay() + dayIndex + 1)

            await api.put("/schedule", {
                userId: employeeId,
                date: date.toISOString(),
                shift: shift,
            })

            const scheduleRes = await api.get("/schedule")
            setSchedule(scheduleRes.data)
        } catch (err) {
            console.error("Could not assign shift", err)
        }
    }

    const removeShift = async (entry: ScheduleEntry) => {
        try {
            await api.delete("/schedule", {
                data: {
                    userId: entry.userId,
                    date: entry.date,
                    shift: entry.shift,
                }
            })

            const scheduleRes = await api.get("/schedule")
            setSchedule(scheduleRes.data)
        } catch (err) {
            console.error("Could not remove shift", err)
        }
    }

    const getAssigned = (day: string, shift: string) => {
        return schedule.filter(entry => {
            const entryDay = new Date(entry.date).getDay()
            const dayIndex = days.indexOf(day) + 1
            return entryDay === dayIndex && entry.shift === shift
        })
    }

    if (loading) return <p className="p-8">Loading...</p>

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
                                        {getAssigned(day, shift).map(entry => (
                                            <div key={entry.id} className="flex items-center justify-between bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                <span>{entry.user.firstName}</span>
                                                <button
                                                    onClick={() => removeShift(entry)}
                                                    className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    assignShift(parseInt(e.target.value), day, shift)
                                                    e.target.value = ""
                                                }
                                            }}
                                            className="text-xs border rounded px-1 py-1 cursor-pointer"
                                        >
                                            <option value="">+ Add</option>
                                            {employees
                                                .filter(emp => !shifts.some(s =>
                                                    getAssigned(day, s).some(entry => entry.userId === emp.id)
                                                ))
                                                .map(emp => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.firstName} {emp.lastName}
                                                    </option>
                                                ))}
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