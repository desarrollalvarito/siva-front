export default () => {
  return 'Hello Util'
}

export const jobRoles = [
  { title: 'Gerente', value: 'Gerente' },
  { title: 'Administrador', value: "Administrador" },
  { title: 'Hornero', value: "Hornero" },
  { title: 'Repartidor', value: "Repartidor" },
  { title: 'Cajero', value: "Cajero" },
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
  { title: 'Masculino', value: 'Masculino' },
  { title: 'Femenino', value: 'Femenino' },
  { title: 'Otro', value: 'Otro' },
]

export const stateList = [
  { title: 'Activo', value: 'A' },
  { title: 'Borrado', value: 'X' },
]

export const headersEmployees = [
  { title: 'RUN', key: 'person.run', align: 'start' },
  { title: 'Nombre', key: 'fullName', value: item => `${item.person.names} ${item.person.lastName}` },
  { title: 'Cargo', key: 'jobRole' },
  { title: 'Turno', key: 'workShift' },
  { title: 'Domicilio', key: 'person.address' },
  { title: 'Celular', key: 'person.contact' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

export const headersProducts = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Producto', key: 'name' },
  { title: 'Precio', key: 'price', align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]
