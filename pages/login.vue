<script setup lang="ts">
import logo from '@images/logo.svg?raw'
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg?url'
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg?url'

const { signIn } = useAuth()
const error = ref(false)
const text = ref('')

const form = reactive(
  {
    username: '',
    password: '',
    remember: false,
  },
)

const submit = async () => {
  if (!form.username || !form.password) {
    text.value = 'Por favor, complete todos los campos.'
    error.value = true
  }
  else {
    try {
      await signIn({ username: form.username, password: form.password }, { callbackUrl: '/home' })
    }
    catch (err) {
      text.value = 'Usuario o contraseña incorrectos, por favor intente de nuevo.'
      error.value = true
    }
  }
}

const isPasswordVisible = ref(false)

definePageMeta({
  layout: 'blank',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/home',
  },
})
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg :src="authV1TopShape" class="text-primary auth-v1-top-shape d-none d-sm-block" />

      <!-- 👉 Bottom shape -->
      <VImg :src="authV1BottomShape" class="text-primary auth-v1-bottom-shape d-none d-sm-block" />

      <!-- 👉 Auth Card -->
      <VCard class="auth-card" max-width="460" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'">
        <VCardItem class="justify-center">
          <NuxtLink to="/" class="app-logo">
            <!-- eslint-disable vue/no-v-html -->
            <div class="d-flex" v-html="logo" />
            <h1 class="app-logo-title">
              SIVA
            </h1>
          </NuxtLink>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            Bienvenido a SIVA! 👋🏻
          </h4>
          <p class="mb-0">
            Iniciar Sesion
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="submit">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <VTextField v-model="form.username" autofocus label="Usuario" type="mi usuario"
                  placeholder="username" />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="form.password" label="Contraseña" placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'" autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox v-model="form.remember" label="Recuerdame" />
                </div>
                <!-- error message -->
                <VSnackbar v-model="error" color="error">
                  {{ text }}
                </VSnackbar>
                <!-- login button -->
                <VBtn block type="submit">
                  Ingresar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
