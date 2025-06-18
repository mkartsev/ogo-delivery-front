import API_URL          from '@/settings'
import { ref }          from 'vue'
import Axios            from 'axios'
import { authHeader }   from '@/helpers'
import { useUserStore } from '@/stores/user.store'
import { auth }         from '@/services/auth.service'

function handleError(error) {
  const { user } = useUserStore()
  const { logout } = auth
  if ([401, 403].includes(error.response.status) && user) {
    logout()
  }
  api.error.value = error.message
  console.error(error.message)
}
export const api = {
  loading: ref(false),
  submitting: ref(false),
  error: ref(null),
  async sendPin(username) {
    try {
      api.error.value = null
      api.submitting.value = true
      return await Axios.post(`${API_URL}/users/${username}/send_pin`)
    } catch(error) {
      handleError(error)
    } finally {
      api.submitting.value = false
    }
  },
  async postToken(params) {
    try {
      api.error.value = null
      api.submitting.value = true
      return await Axios.post(`${API_URL}/token`, params, {
        // нам нужен будет response.data.access_token
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.submitting.value = false
    }
  },
  async fetchDeliveries() {
    try {
      api.error.value = null
      api.loading.value = true
      return await Axios.get(`${API_URL}/deliveries`, {
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.loading.value = false
    }
  },
  async fetchDelivery(uid) {
    try {
      api.error.value = null
      api.loading.value = true
      return await Axios.get(`${API_URL}/deliveries/${uid}`, {
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.loading.value = false
    }
  },
  async createPayment(deliveryUID, orderUID, items) {
    try {
      api.error.value = null
      api.submitting.value = true
      return await Axios.post(`${API_URL}/deliveries/${deliveryUID}/orders/${orderUID}/payment`, items, {
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.submitting.value = false
    }
  },
  async cancelOrder(deliveryUID, orderUID) {
    try {
      api.error.value = null
      api.submitting.value = true
      return await Axios.post(`${API_URL}/deliveries/${deliveryUID}/orders/${orderUID}/cancel`, null, {
        headers: authHeader()
      })
    }
    catch(error) {
      handleError(error)
    } finally {
      api.submitting.value = false
    }
  },
  async shipOrder(deliveryUID, orderUID) {
    try {
      api.error.value = null
      api.submitting.value = true
      return await Axios.post(`${API_URL}/deliveries/${deliveryUID}/orders/${orderUID}/ship`, null, {
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.submitting.value = false
    }
  },
  async getReceipt (deliveryUID, orderUID) {
    try {
      api.error.value = null
      api.loading.value = true
      return await Axios.get(`${API_URL}/deliveries/${deliveryUID}/orders/${orderUID}/receipt_b64`, {
        headers: authHeader()
      })
    } catch(error) {
      handleError(error)
    } finally {
      api.loading.value = false
    }
  }
}