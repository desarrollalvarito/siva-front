export interface Product {
  id?: number
  name: string
  price: float
  userAt?: number
}

export interface Person {
  id: number
  run: string
  names: string
  lastName: string
  address?: string
  contact?: string
  gender: string
  birthDate: Date | null
}

export interface Employee {
  id?: number
  jobRole: string
  workShift: string
  personId: number
  person: Person
}
