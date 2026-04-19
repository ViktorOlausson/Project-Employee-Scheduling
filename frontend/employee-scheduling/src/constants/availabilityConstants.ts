
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const dayMap: { [key: number]: string } = {
  0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
}
export const shifts = ["MORNING", "AFTERNOON", "NIGHT"]


export type Availability = {
  [shift: string]: { [day: string]: boolean }
}

export const createEmptyAvailability = (): Availability => ({
    MORNING:   { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    AFTERNOON: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    NIGHT:     { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  })