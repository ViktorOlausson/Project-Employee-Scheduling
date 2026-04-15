import { Navigate } from "react-router-dom"

type Props = {
  children: React.ReactNode
  allowedRole: string
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/" />
  }

  const payload = JSON.parse(atob(token.split(".")[1]))

  if (payload.role !== allowedRole) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default ProtectedRoute