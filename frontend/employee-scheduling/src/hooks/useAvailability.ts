import { useQuery } from "@tanstack/react-query"
import api from "../services/api"
import { createEmptyAvailability } from "../constants/availabilityConstants"
import { getEmployeeId } from "../utils/getEmployeeId"

export const useAvailability = () => {
    return useQuery({
        queryKey: ["availability", getEmployeeId()],
        queryFn: async () => {
            const response = await api.get(`/availability/${getEmployeeId()}`)
            const updated = createEmptyAvailability()
            for (const entry of response.data) {
                updated[entry.shift][entry.dayOfWeek] = true
            }
            return updated
        }
    })
}