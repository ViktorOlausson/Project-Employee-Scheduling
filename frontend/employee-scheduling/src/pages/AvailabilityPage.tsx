import { useState } from 'react'
import api from '../services/api'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const shifts = ['Morning shift', 'Afternoon shift', 'Night shift']

type Availability = {
  [shift: string]: {
    [day: string]: boolean
  }
}

const initialAvailability: Availability = {
  'Morning shift': { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  'Afternoon shift': { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  'Night shift': { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
}

const AvailabilityPage = () => {
  const [availability, setAvailability] = useState<Availability>(initialAvailability)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggle = (shift: string, day: string) => {
    const updated = { ...availability }
    updated[shift][day] = !updated[shift][day]
    setAvailability(updated)
  }

  const handleSave = async () => {
    try {
      await api.put('/availability/:employeeId', { availability })
      setSuccess(true)
    } catch (err) {
      setError('Could not save availability')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Availability</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Availability saved!</p>}

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <th className="text-left p-2"></th>
            {days.map((day) => (
              <th key={day} className="p-2 text-sm font-medium">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift} className="border-t">
              <td className="p-2 text-sm font-medium w-36">{shift}</td>
              {days.map((day) => (
                <td key={day} className="p-2 text-center">
                  <button
                    onClick={() => toggle(shift, day)}
                    className={`w-20 py-1 rounded text-sm font-medium ${
                      availability[shift][day]
                        ? 'bg-green-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {availability[shift][day] ? 'Available' : 'Unavailable'}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm font-medium"
      >
        Save
      </button>
    </div>
  )
}

export default AvailabilityPage