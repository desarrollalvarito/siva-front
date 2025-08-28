export interface Product {
  id?: number
  name: string
  price: number
  userAt?: number
}

export interface Person {
  id?: number
  run: string
  names: string
  lastName: string
  address?: string
  contact?: string
  gender: string
  birthdate: Date | null | string | unknown
}

export interface Employee {
  id?: number
  jobRole: string
  workShift: string
  person: Person

}
export interface Client {
  id?: number
  shippingAddress: string
  billName: string
  rut: string
  person: Person
}

export interface Order {
  id?: number
  date: Date | string | null
  client: Client
  quantity: number
  state: string
  userAt?: number
  orderProduct: OrderProduct[]
  delivery?: Delivery
}

export interface OrderProduct {
  id?: number
  orderId?: number
  quantity: number
  aditional: boolean
  product: Product
  state?: string
  userAt?: number
}

export interface Delivery {
  id?: number,
  order?: Order
  status: string
  driver: Employee
  deliveryTime?: Date
  scheduled?: Date
  notes?: string
  userAt?: number
}
