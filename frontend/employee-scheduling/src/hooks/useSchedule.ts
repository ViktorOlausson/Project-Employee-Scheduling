import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"

export const useSchedule = () => {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: () => api.get("/schedule").then(res => res.data)
    })
}

export const useAssignShift = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { userId: number, date: string, shift: string }) =>
            api.put("/schedule", data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedule"] })
    })
}

export const useRemoveShift = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: { userId: number, date: string, shift: string }) =>
            api.delete("/schedule", { data }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["schedule"] })
    })
}