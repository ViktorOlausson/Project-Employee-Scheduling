import { useQuery } from "@tanstack/react-query"
import api from "../services/api"

export const useEmployees = () => {
    return useQuery({
        queryKey: ["employees"],
        queryFn: () => api.get("/users/employees/all").then(res => res.data)
    })
}