export interface ScheduleEntry {
    id: number
    userId: number
    date: string
    shift: string
    user: {
        id: number
        firstName: string
        lastName: string
        Occupation: string
    }
}

export interface Employee {
    id: number
    firstName: string
    lastName: string
    Occupation: string
}

export interface Availability {
    id: number
    userId: number
    dayOfWeek: string
    shift: string
}

export interface Employee {
    id: number
    email: string
    firstName: string
    lastName: string
    Occupation: string
    role: string
  }