import { useQuery } from "@tanstack/react-query"
import api from "../services/api"
import { getEmployeeId } from "../utils/getEmployeeId"

export const useMySchedule = () => {
    return useQuery({
        queryKey: ["mySchedule", getEmployeeId()],
        queryFn: async () => {
            try {
                const res = await api.get(`/schedule/${getEmployeeId()}`)
                return res.data
            } catch {
                return []
            }
        }
    })
}