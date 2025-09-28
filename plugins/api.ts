export default defineNuxtPlugin(() => {
  const { token, refreshToken, status, refresh, signOut } = useAuth()
  const config = useRuntimeConfig()

  // Función para construir URL completa siempre
  const buildApiUrl = (endpoint: string): string => {
    if (endpoint.startsWith('/siva/')) {
      const apiPath = endpoint.replace('/siva/', '/api/')
      const baseUrl = config.public.apiBase.replace(/\/+$/, '')

      return `${baseUrl}${apiPath}`
    }

    if (endpoint.startsWith('http'))
      return endpoint

    const baseUrl = config.public.apiBase.replace(/\/+$/, '')

    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  // Detectar si estamos en modo desarrollo (cross-origin)
  const isCrossOrigin = () => {
    if (process.server)
      return false

    const apiUrl = new URL(config.public.apiBase)
    const currentOrigin = window.location.origin

    return apiUrl.origin !== currentOrigin
  }

  const $api = async <T = any>(url: string, options: any = {}): Promise<T> => {
    const finalUrl = buildApiUrl(url)

    console.log(`🔗 API Call: ${url} -> ${finalUrl}`)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Agregar token si existe
    if (token.value) {
      headers.Authorization = token.value
    }
    else if (refreshToken.value && status.value === undefined) {
      await refresh()
      if (token.value)
        headers.Authorization = token.value
    }

    // Configurar credentials según si es cross-origin o no
    const fetchOptions: any = {
      ...options,
      headers,
    }

    // Solo incluir credentials si no es cross-origin o si tenemos configuración específica
    if (!isCrossOrigin()) {
      fetchOptions.credentials = 'include'
    }
    else {
      // En desarrollo cross-origin, no usar credentials para evitar CORS
      console.log('🌐 Cross-origin detected, omitting credentials')
    }

    try {
      return await $fetch<T>(finalUrl, fetchOptions)
    }
    catch (error: any) {
      console.error('❌ API Error:', {
        originalUrl: url,
        finalUrl,
        isCrossOrigin: isCrossOrigin(),
        status: error.status || error.statusCode,
        statusText: error.statusText,
        message: error.message,
        response: error.data,
      })

      if (error.status === 401 || error.statusCode === 401)
        signOut()

      throw error
    }
  }

  return {
    provide: {
      api: $api,
    },
  }
})
