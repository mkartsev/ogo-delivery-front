<script setup>
  import { pluralForm, countItems, countPrice } from '@/helpers'
  import OrderStatus from '@/components/OrderStatus.vue'

  defineProps({
    uid: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    orders: {
      type: Array,
      required: true,
    },
  })
</script>

<template>
  <router-link :to="`/deliveries/${uid}`" class="block border-b border-b-gray-200">
    <div class="py-4 px-6">
      <h2 class="text-neutral-800 text-2xl font-semibold hover:text-red-500">{{ address.address }}</h2>
    </div>

    <div class="pt-1 pb-6 px-6 space-y-3">
      <div v-for="order in orders" 
        :key="order.uid"
        class="grid grid-cols-[mincontent_auto] auto-rows-max gap-x-1 gap-y-2.5 py-5 px-5 bg-gray-100 rounded-2xl"
      >
        <span class="text-xl">#{{ order.id }}</span>
        <div class="flex justify-end items-center gap-3">
          <order-status :status="order.payment_status"></order-status>
          <order-status :status="order.status"></order-status>
        </div>
        <span class="col-span-2 text-gray-400">{{ pluralForm(countItems(order.items),['товар', 'товара', 'товаров']) }} на сумму {{ countPrice(order.items) }} ₽</span>
      </div>
    </div>
  </router-link>
</template>