import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const RegisterEmployeePage = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [occupation, setOccupation] = useState("RUNNER")
    const [loginCode, setLoginCode] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            await api.post("/users", {
                firstName,
                lastName,
                email,
                Occupation: occupation,
                role: "EMPLOYEE",
                password: loginCode,
              })
            setSuccess(true)
            setTimeout(() => navigate("/employees"), 1500)
        } catch (err) {
            setError("Could not register employee")
        }
    }

    return (
        <div className="p-8 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Register new employee</h1>
                <button
                    onClick={() => navigate("/employees")}
                    className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                >
                    ×
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">Employee registered!</p>}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm cursor-pointer"
                >
                    <option value="RUNNER">Runner</option>
                    <option value="WAITER">Waiter</option>
                    <option value="DISHWASHER">Dishwasher</option>
                    <option value="CHEF">Chef</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                    type="text"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium cursor-pointer"
            >
                Save
            </button>
        </div>
    )
}

export default RegisterEmployeePage