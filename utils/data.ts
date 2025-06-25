export default () => {
  return 'Hello Util'
}

export const jobRoles = [
  { title: 'Gerente', value: 1 },
  { title: 'Administrador', value: 2 },
  { title: 'Hornero', value: 3 },
  { title: 'Repartidor', value: 4 },
  { title: 'Cajero', value: 5 },
]

export const workShifts = [
  { title: 'Mañana', value: 'M' },
  { title: 'Tarde', value: 'T' },
  { title: 'Noche', value: 'N' },
  { title: 'Rotativo', value: 'R' },
  { title: 'Media Jornada', value: 'MJ' },
  { title: 'Jornada Completa', value: 'JC' },
]

export const genderList = [
  { title: 'Masculino', value: 'M' },
  { title: 'Femenino', value: 'F' },
  { title: 'Otro', value: 'O' },
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
