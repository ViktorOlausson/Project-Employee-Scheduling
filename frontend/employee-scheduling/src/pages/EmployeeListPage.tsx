import { useState, useEffect } from 'react'
import api from '../services/api'

interface Employee {
  id: number
  email: string
  firstName: string
  lastName: string
  Occupation: string
  role: string
}

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/users/employees/all')
        setEmployees(response.data)
      } catch (err) {
        setError('Could not fetch employees')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Employees</h1>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded shadow p-4 flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                {emp.firstName[0]}{emp.lastName[0]}
              </div>
              <div>
                <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                <p className="text-sm text-gray-500">{emp.email}</p>
                <p className="text-sm text-gray-400">{emp.Occupation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeListPage