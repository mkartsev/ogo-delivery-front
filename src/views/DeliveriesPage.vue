<script setup>
  import { storeToRefs }        from 'pinia'
  import { useDeliveriesStore } from '@/stores/deliveries.store'
  import OrdersList             from '@/components/OrdersList.vue'

  const deliveriesStore = useDeliveriesStore()
  const { deliveries } = storeToRefs(deliveriesStore)

  deliveriesStore.checkDeliveries()
</script>

<template>
  <section v-if="deliveries" class="deliveries-list">
    <router-link v-for="delivery in deliveries" 
      :to="`/deliveries/${delivery.uid}`"
      :key="delivery.uid"
      class="block border-b border-b-gray-200"
    >
      <div class="py-4 px-6">
        <span class="text-neutral-800 text-2xl font-semibold hover:text-red-500">{{ delivery.address.address }}</span>
      </div>
      <div class="pt-1 pb-6 px-6 space-y-3">
        <orders-list :orders="delivery.orders" :links="false"></orders-list>
      </div>
    </router-link>
  </section>
</template>
