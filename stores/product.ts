export const useWebsiteStore = defineStore('productStore', {
  state: () => ({
    name: '',
    price: '',
    userAt: ''
  }),
  actions: {
    async fetch() {
      const infos = await $fetch(process.env.NUXT_PUBLIC_API_URL + '/product/get')
      this.name = infos.name
      this.price = infos.price
      this.userAt = infos.userAt
    }
  }
})
