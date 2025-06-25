<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <VerticalNavLink
    :item="{
      title: 'Inicio',
      icon: 'bx-home',
      to: '/dashboard',
    }"
  />
  <VerticalNavSectionTitle
    :item="{
      heading: 'Gestion de Personas',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Empleados',
      icon: 'mdi-badge-account-horizontal-outline',
      to: '/employees',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Clientes',
      icon: 'mdi-account-group',
      to: '/clients',
    }"
  />
  <VerticalNavSectionTitle
    :item="{
      heading: 'Gestion Comercial',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Productos',
      icon: 'mdi-food',
      to: '/products',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Pedidos',
      icon: 'mdi-book-edit-outline',
      to: '/orders',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Ventas',
      icon: 'mdi-storefront-plus-outline',
      to: '/sales',
    }"
  />
</template>
