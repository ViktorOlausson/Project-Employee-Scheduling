import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token } = response.data
  
      localStorage.setItem('token', token)
  
      const payload = JSON.parse(atob(token.split('.')[1]))
      localStorage.setItem('role', payload.role)
  
      if (payload.role === 'EMPLOYER') {
        navigate('/employees')
      } else {
        navigate('/availability')
      }
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Sundsgården</h1>
        <h2 className="text-lg text-center mb-6 text-gray-600">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="email@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm font-medium"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default LoginPage