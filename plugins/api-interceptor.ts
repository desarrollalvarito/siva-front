export default defineNuxtPlugin(() => {
    const { status, token, refreshToken, refresh } = useAuth()
    const config = useRuntimeConfig()

    // Guardar referencia original de $fetch
    const originalFetch = globalThis.$fetch

    // Override global de $fetch
    globalThis.$fetch = async (request, options) => {
        const requestUrl = typeof request === 'string' ? request : request.url
        const isAuthEndpoint = requestUrl?.includes('/auth/')
        const isLoginEndpoint = requestUrl?.includes('/auth/login')
        const isApiRequest = requestUrl?.includes(config.public.apiBase)

        // Si no hay token
        if (isApiRequest && !isAuthEndpoint) {
            if (status.value === undefined) {
                console.log("consultando", request, token, status.value);
            }
        }

        // Solo inyectar token en endpoints API que no son de auth
        if (isApiRequest && !isAuthEndpoint && status.value === 'authenticated') {
            try {
                if (token) {
                    options = options || {}
                    options.headers = {
                        ...options.headers,
                        'Authorization': token.value ?? '',
                    }
                }
                else { console.log(refreshToken); }
            } catch (error) {
                console.warn('No se pudo obtener token para API:', error)
            }
        }

        return originalFetch(request, options)
    }

    // Interceptor para axios si lo estás usando
    if (process.client && typeof window !== 'undefined') {
        const { $axios } = useNuxtApp()

        if ($axios) {
            $axios.interceptors.request.use(async (config) => {
                const url = config.url || ''
                const isAuthEndpoint = url.includes('/auth/')
                const isApiRequest = url.includes(config.public.apiBase)
                console.log(status, token);
                if (isApiRequest && !isAuthEndpoint && status.value === 'authenticated') {
                    try {
                        if (token) {
                            config.headers.Authorization = token.value ?? ''
                        }
                    } catch (error) {
                        console.warn('No se pudo obtener token para axios:', error)
                    }
                }

                return config
            })
        }
    }
})
