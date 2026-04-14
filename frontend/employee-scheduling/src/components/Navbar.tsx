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
                {role === "EMPLOYER" && (
                    <>
                        <button onClick={() => navigate("/employees")} className="text-sm hover:underline cursor-pointer">Employees</button>
                        <button onClick={() => navigate("/schedule")} className="text-sm hover:underline cursor-pointer">Schedule</button>
                    </>
                )}

                {role === "EMPLOYEE" && (
                    <>
                        <button onClick={() => navigate("/availability")} className="text-sm hover:underline cursor-pointer">My Availability</button>
                        <button onClick={() => navigate("/my-schedule")} className="text-sm hover:underline cursor-pointer">My Schedule</button>
                    </>
                )}

                <button onClick={handleLogout} className="text-sm text-red-500 hover:underline cursor-pointer">Logout</button>
            </div>
        </nav>
    )
}

export default Navbar