export default defineNuxtPlugin(() => {
    // No necesitas la baseURL aquí, el proxy ya la maneja
    const { token, refreshToken, status, refresh, signOut } = useAuth()

    const $api = $fetch.create({
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        async onRequest({ options }) {
            if (token.value || refreshToken.value) {
                if (status.value === undefined) {
                    refresh()
                }
                options.headers = {
                    ...options.headers,
                    Authorization: token.value
                }
            }
        },
        onResponseError({ response }) {
            if (response.status === 401) {
                signOut()
            }
        }
    })

    return {
        provide: {
            api: $api
        }
    }
})
