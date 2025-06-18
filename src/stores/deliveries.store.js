import { ref, watch }  from 'vue'
import { defineStore } from 'pinia'
import { api }         from '@/services/api.service'

export const useDeliveriesStore = defineStore("deliveries", () => {
  const deliveries = ref([])
  const checkDeliveries = async () => {
    let savedDeliveries = localStorage.getItem("deliveries")

    if (savedDeliveries) {
      deliveries.value = JSON.parse(savedDeliveries)
    } else {
      api.fetchDeliveries()
      .then(
        response => {
          deliveries.value = response.data
        }
      )
    }
  }

  watch(
    () => (deliveries.value), // смотрим за доставками
    (state) => {
      console.log('watcher: доставки обновились, сохраняем')
      localStorage.setItem('deliveries', JSON.stringify(state))
    }, { deep: true }
  )
  return {
    deliveries, checkDeliveries
  }
})