export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para determinar el color según el estado
export const getStateColor = (state: string) => {
  switch (state) {
    case 'PENDING': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'secondary'
  }
}

// Función para formatear el estado para mostrar
export const formatState = (state: string) => {
  return statusList.find(item => item.value === state)?.title || state
}
