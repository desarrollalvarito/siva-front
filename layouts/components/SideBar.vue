<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <VerticalNavLink :item="{
    title: 'Inicio',
    icon: 'bx-home',
    to: '/home',
  }" />
  <VerticalNavSectionTitle :item="{
    heading: 'Gestion de Personas',
  }" />
  <VerticalNavLink :item="{
    title: 'Empleados',
    icon: 'mdi-badge-account-horizontal',
    to: '/employees',
  }" />
  <VerticalNavLink :item="{
    title: 'Clientes',
    icon: 'mdi-account-group',
    to: '/clients',
  }" />
  <VerticalNavSectionTitle :item="{
    heading: 'Gestion Comercial',
  }" />
  <VerticalNavLink :item="{
    title: 'Productos',
    icon: 'mdi-food',
    to: '/products',
  }" />
  <VerticalNavLink :item="{
    title: 'Pedidos',
    icon: 'mdi-book',
    to: '/orders',
  }" />
  <VerticalNavLink :item="{
    title: 'Produccion',
    icon: 'mdi-hamburger',
    to: '/productions',
  }" />
  <VerticalNavLink :item="{
    title: 'Ventas',
    icon: 'mdi-storefront',
    to: '/sales',
  }" />
  <VerticalNavSectionTitle :item="{
    heading: 'Reportes',
  }" />
  <VerticalNavGroup :item="{
    title: 'Comercial',
    icon: 'mdi-chart-bar',
  }">
    <VerticalNavLink :item="{
      title: 'Pedidos',
      to: '/sales',
    }" />
    <VerticalNavLink :item="{
      title: 'Ventas',
      to: '/sales',
    }" />
  </VerticalNavGroup>
</template>
