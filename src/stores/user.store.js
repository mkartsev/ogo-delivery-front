import { ref }         from 'vue'
import { router }      from '@/router'
import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", () => {
  
  const user = ref(localStorage.getItem("user"))
  const deliveryToken = ref(localStorage.getItem("deliveryToken"))

  const login = (username, token) => {
    user.value = username
    deliveryToken.value = token

    localStorage.setItem('user', username)
    localStorage.setItem('deliveryToken', token)
  }

  const logout = () => {
    user.value = null
    deliveryToken.value = null
    localStorage.clear()
    router.push('/login')
  }

  return {
    user, deliveryToken, login, logout
  }
})