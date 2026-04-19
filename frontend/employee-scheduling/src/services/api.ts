import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const deleteEmployee = async (id: number) => {
	const res = await fetch(`http://localhost:3000/users/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("Failed to delete employee");
	}

	return res.json();
};

export default api