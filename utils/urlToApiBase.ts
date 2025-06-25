export default (url: string) => {
  const config = useRuntimeConfig()

  return config.public.apiBase + url
}
