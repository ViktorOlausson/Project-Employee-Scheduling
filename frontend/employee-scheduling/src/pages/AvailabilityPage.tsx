import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import api from "../services/api"
import { days, shifts, type Availability } from "../constants/availabilityConstants"
import { getEmployeeId } from "../utils/getEmployeeId"
import { useAvailability } from "../hooks/useAvailability"

const AvailabilityPage = () => {
    const { data } = useAvailability()
    const [availability, setAvailability] = useState<Availability | null>(null)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (data) setAvailability(data)
    }, [data])

    const { mutate: saveAvailability } = useMutation({
        mutationFn: async () => {
            const entries = []
            for (const shift of shifts) {
                for (const day of days) {
                    if (availability?.[shift][day]) {
                        entries.push({ dayOfWeek: day, shift })
                    }
                }
            }
            await api.put(`/availability/${getEmployeeId()}`, { entries })
        },
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        },
        onError: () => {
            setError("Could not save availability")
            setTimeout(() => setError(""), 3000)
        }
    })

    const toggle = (shift: string, day: string) => {
        if (!availability) return
        setAvailability(prev => ({
            ...prev!,
            [shift]: { ...prev![shift], [day]: !prev![shift][day] }
        }))
    }

    if (!availability) return <p className="p-8">Loading...</p>

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Availability</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">Availability saved!</p>}

            <table className="w-full border-collapse mb-6">
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
                                <td key={day} className="p-2 text-center">
                                    <button
                                        onClick={() => toggle(shift, day)}
                                        className={`w-20 py-1 rounded text-sm font-medium cursor-pointer ${availability[shift][day]
                                            ? "bg-green-400 text-white"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {availability[shift][day] ? "Available" : "Unavailable"}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={() => saveAvailability()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm font-medium cursor-pointer"
            >
                Save
            </button>
        </div>
    )
}

export default AvailabilityPage