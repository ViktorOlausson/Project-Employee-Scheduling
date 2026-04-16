
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const shifts = ["MORNING", "AFTERNOON", "NIGHT"]


export type Availability = {
  [shift: string]: { [day: string]: boolean }
}

export const createEmptyAvailability = (): Availability => ({
    MORNING:   { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    AFTERNOON: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    NIGHT:     { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  })