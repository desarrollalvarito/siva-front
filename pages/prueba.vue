<script setup lang="ts">
import type { ApiResponse } from '@/types/api';
import type { Product } from '@/types/model';
const { data: user } = await useFetch('/siva/v1/auth/get');
const { data: products } = await useFetch('/siva/v1/product/list');
const { $api } = useNuxtApp()
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await $api<ApiResponse<Product[]>>('/siva/v1/product/list')
    // ... el resto de la lógica sigue igual
    return response.data || [];
  } catch (error: any) {
    // Puedes manejar el error aquí si lo deseas
    return [];
  }
}
</script>

<template>
  <div>
    <h1>Usuario</h1>
    <pre>{{ user }}</pre>
  </div>
  <div>{{ fetchProducts() }}</div>
</template>
