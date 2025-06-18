<script setup>
  import { pluralForm, countItems, countPrice } from '@/helpers'
  import OrderStatus from '@/components/OrderStatus.vue'

  defineProps({
    orders: {
      type: Array,
      required: true,
    },
    links: {
      type: Boolean,
      default: false,
      required: false
    },
    deliveryUID: {
      type: String
    }
  })
</script>

<template>
  <template v-if="links">
    <router-link v-for="order in orders" 
      :key="order.uid" 
      :to="`/deliveries/${deliveryUID}/orders/${order.uid}`" 
      class="grid grid-cols-[mincontent_auto] auto-rows-max gap-x-1 gap-y-2.5 py-5 px-5 bg-gray-100 rounded-2xl"
    >
      <span class="text-xl">#{{ order.id }}</span>
      <div class="flex justify-end items-center gap-3">
        <order-status :status="order.payment_status"></order-status>
        <order-status :status="order.status"></order-status>
      </div>
      <span class="col-span-2 text-gray-400">{{ pluralForm(countItems(order.items), ['товар', 'товара', 'товаров']) }} на сумму {{ countPrice(order.items) }}&nbsp;₽</span>
    </router-link>
  </template>

  <template v-else>
    <div v-for="order in orders" 
      :key="order.uid" 
      class="grid grid-cols-[mincontent_auto] auto-rows-max gap-x-1 gap-y-2.5 py-5 px-5 bg-gray-100 rounded-2xl"
    >
      <span class="text-xl">#{{ order.id }}</span>
      <div class="flex justify-end items-center gap-3">
        <order-status :status="order.payment_status"></order-status>
        <order-status :status="order.status"></order-status>
      </div>
      <span class="col-span-2 text-gray-400">{{ pluralForm(countItems(order.items), ['товар', 'товара', 'товаров']) }} на сумму {{ countPrice(order.items) }}&nbsp;₽</span>
    </div>
  </template>
</template>