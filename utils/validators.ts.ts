import type { ProductCreate } from "@/types/model";

export const validateProduct = (product: Partial<ProductCreate>): string[] => {
  const errors: string[] = [];

  if (!product.name?.trim()) {
    errors.push('El nombre del producto es requerido');
  } else if (product.name.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (product.name.length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres');
  }

  if (!product.price && product.price !== 0) {
    errors.push('El precio es requerido');
  } else if (product.price <= 0) {
    errors.push('El precio debe ser mayor a 0');
  } else if (product.price > 1000000) {
    errors.push('El precio no puede exceder $1,000,000');
  }

  if (!product.userAt) {
    errors.push('User ID es requerido');
  } else if (product.userAt <= 0) {
    errors.push('User ID debe ser válido');
  }

  return errors;
};
