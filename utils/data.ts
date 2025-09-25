export default () => {
  return 'Hello Util'
}

export const jobRoles = [
  { title: 'Gerente', value: 'MANAGER' },
  { title: 'Administrador', value: "ADMIN" },
  { title: 'Hornero', value: "BAKER" },
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

export const statusList = [
  { title: 'Pendiente', value: 'PENDING' },
  { title: 'Entregado', value: 'COMPLETED' },
  { title: 'Cancelado', value: 'CANCELLED' },
  { title: 'En producción', value: 'IN_PRODUCTION' },
  { title: 'Listo para entrega', value: 'READY' },
  { title: 'En preparación', value: 'IN_PROGRESS' },
  { title: 'Programado', value: 'SCHEDULED' },
  { title: 'En camino', value: 'IN_TRANSIT' },
  { title: 'Entregado', value: 'DELIVERED' },
]

export const headersEmployees = [
  { title: 'RUN', key: 'person.run', align: 'start' },
  { title: 'Nombre', key: 'fullName', value: (item: any) => `${item.person.names} ${item.person.lastName}`, align: 'start' },
  { title: 'Cargo', key: 'jobRole', align: 'start' },
  { title: 'Turno', key: 'workShift', align: 'center' },
  { title: 'Domicilio', key: 'person.address', align: 'center' },
  { title: 'Celular', key: 'person.contact', align: 'center' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersProducts = [
  { title: 'Producto', key: 'name', align: 'start' },
  { title: 'Precio', key: 'price', value: (item: any) => `$ ${item.price}`, align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersOrderProducts = [
  { title: 'Producto', key: 'product.name', align: 'start' },
  { title: 'Precio U.', key: 'product.price', value: (item: any) => `$ ${item.product.price}`, align: 'end' },
  { title: 'Cantidad', key: 'quantity' },
  { title: 'Subtotal', key: 'subtotal', value: (item: any) => `$ ${item.product.price * item.quantity}`, align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersClients = [
  { title: 'RUT', key: 'rut', align: 'start' },
  { title: 'Cliente', key: 'billName', align: 'start' },
  { title: 'Nombre', key: 'fullName', value: (item: any) => `${item.person.names} ${item.person.lastName}`, align: 'start' },
  { title: 'Direccion de entrega', key: 'shippingAddress', align: 'center' },
  { title: 'Celular', key: 'person.contact', align: 'center' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersOrders = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'RUT', key: 'client.rut', align: 'start' },
  { title: 'Cliente', key: 'client.billName', align: 'center' },
  { title: 'Cantidad', key: 'quantity', align: 'center' },
  { title: 'Estado', key: 'state', align: 'center' },
  { title: 'Acciones', key: 'actions', align: 'end', sortable: false }
]

export const headersProductionProducts = [
  { title: 'Producto', key: 'name', sortable: true },
  { title: 'Órdenes Pendientes', key: 'pending', align: 'end', sortable: true },
  { title: 'Producción Existente', key: 'productions', align: 'end', sortable: true },
  { title: 'Cantidad a Producir', key: 'quantity', align: 'center', sortable: false },
  { title: 'Stock Disponible', key: 'available', align: 'end', sortable: true }
]
