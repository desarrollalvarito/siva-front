export default () => {
  return 'Hello Util'
}

export const jobRoles = [
  { title: 'Gerente', value: 'MANAGER' },
  { title: 'Administrador', value: "ADMINISTRATOR" },
  { title: 'Hornero', value: "COOK" },
  { title: 'Repartidor', value: "DELIVERY" },
  { title: 'Cajero', value: "CASHIER" },
]

export const workShifts = [
  { title: 'Mañana', value: 'Mañana' },
  { title: 'Tarde', value: 'Tarde' },
  { title: 'Noche', value: 'Noche' },
  { title: 'Rotativo', value: 'Rotativo' },
  { title: 'Media Jornada', value: 'Media Jornada' },
  { title: 'Jornada Completa', value: 'Jornada Completa' },
]

export const genderList = [
  { title: 'Masculino', value: 'MALE' },
  { title: 'Femenino', value: 'FEMALE' },
  { title: 'Otro', value: 'OTHER' },
]

export const stateList = [
  { title: 'Activo', value: 'ACTIVE' },
  { title: 'Inactivo', value: 'INACTIVE' },
]

export const headersEmployees = [
  { title: 'RUN', key: 'person.run', align: 'start' },
  { title: 'Nombre', key: 'fullName', value: (item: any) => `${item.person.names} ${item.person.lastName}` },
  { title: 'Cargo', key: 'jobRole' },
  { title: 'Turno', key: 'workShift' },
  { title: 'Domicilio', key: 'person.address' },
  { title: 'Celular', key: 'person.contact' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersProducts = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Producto', key: 'name' },
  { title: 'Precio', key: 'price', value: (item: any) => `$ ${item.price}`, align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersOrderProducts = [
  { title: 'Producto', key: 'product.name' },
  { title: 'Precio U.', key: 'product.price', value: (item: any) => `$ ${item.product.price}` },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Subtotal', key: 'subtotal', value: (item: any) => `$ ${item.product.price * item.quantity}`, align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersClients = [
  { title: 'RUT', key: 'rut', align: 'start' },
  { title: 'RUN', key: 'person.run' },
  { title: 'Nombre del RUT', key: 'billName' },
  { title: 'Nombre', key: 'fullName', value: (item: any) => `${item.person.names} ${item.person.lastName}` },
  { title: 'Direccion de entrega', key: 'shippingAddress' },
  { title: 'Domicilio', key: 'person.address' },
  { title: 'Celular', key: 'person.contact' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersOrders = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Fecha', key: 'date', value: (item: any) => new Date(item.date).toISOString().split('T')[0], align: 'start' },
  { title: 'Cliente', key: 'client.billName', align: 'start' },
  { title: 'Cantidad', key: 'quantity', align: 'center' },
  { title: 'Estado', key: 'state', align: 'center' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]
