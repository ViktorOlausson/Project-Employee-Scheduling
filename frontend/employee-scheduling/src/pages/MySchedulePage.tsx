import { useState, useEffect } from "react"
import api from "../services/api"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const shifts = ["MORNING", "AFTERNOON", "NIGHT"]

interface ScheduleEntry {
  id: number
  userId: number
  date: string
  shift: string
}

const getEmployeeId = () => {
  const token = localStorage.getItem("token")
  const payload = JSON.parse(atob(token!.split(".")[1]))
  return payload.userId
}

const MySchedulePage = () => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const employeeId = getEmployeeId()
        const response = await api.get(`/schedule/${employeeId}`)
        setSchedule(response.data)
      } catch (err) {
        console.error("Could not fetch schedule", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  const getShift = (day: string, shift: string) => {
    return schedule.find(entry => {
      const entryDay = new Date(entry.date).getDay()
      const dayIndex = days.indexOf(day) + 1
      return entryDay === dayIndex && entry.shift === shift
    })
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>

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
                  {getShift(day, shift) ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Scheduled
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MySchedulePage