import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Sundsgården</h1>

      <div className="flex gap-4">
        {role === "employer" && (
          <>
            <button onClick={() => navigate("/employees")} className="text-sm hover:underline">Employees</button>
            <button onClick={() => navigate("/schedule")} className="text-sm hover:underline">Schedule</button>
          </>
        )}

        {role === "employee" && (
          <>
            <button onClick={() => navigate("/availability")} className="text-sm hover:underline">My Availability</button>
            <button onClick={() => navigate("/my-schedule")} className="text-sm hover:underline">My Schedule</button>
          </>
        )}

        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar