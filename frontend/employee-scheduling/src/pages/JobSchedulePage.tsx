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

interface Availability {
    id: number
    userId: number
    date: string
    shift: string
}

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
    const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [availability, setAvailability] = useState<Availability[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleRes, employeesRes, availabilityRes] = await Promise.all([
                    api.get("/schedule"),
                    api.get("/users/employees/all"),
                    api.get("/availability")
                ])
                setSchedule(scheduleRes.data)
                setEmployees(employeesRes.data)
                setAvailability(availabilityRes.data)
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

    const isAvailable = (employeeId: number, day: string, shift: string) => {
        return availability.some(entry => {
            const entryDay = new Date(entry.date).getDay()
            const dayIndex = days.indexOf(day) + 1
            return entry.userId === employeeId && entryDay === dayIndex && entry.shift === shift.toUpperCase().replace(" SHIFT", "")
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
                                            <div key={entry.id} className={`flex items-center justify-between text-xs px-2 py-1 rounded ${getOccupationColor(entry.user.Occupation)}`}>
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
                                                    <option
                                                        key={emp.id}
                                                        value={emp.id}
                                                        style={{
                                                            backgroundColor: isAvailable(emp.id, day, shift) ? '#dcfce7' : 'white',
                                                            fontWeight: isAvailable(emp.id, day, shift) ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {isAvailable(emp.id, day, shift) ? "✓ " : ""}{emp.firstName} {emp.lastName}
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