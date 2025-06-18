<script setup>
  import ProductsList from '@/components/ProductsList.vue'
  import OrderStatus from '@/components/OrderStatus.vue'
  import { pluralForm, countItems, countPrice } from '@/helpers'

  defineProps({
    uid: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    }
  })
</script>

<template>
  <router-link :to="`orders/${uid}`" class="grid grid-cols-[mincontent_auto] auto-rows-max gap-x-1 gap-y-2.5 py-5 px-5 bg-gray-100 rounded-2xl">
    <span class="text-xl">#{{ id }}</span>
    <div class="flex justify-end items-center gap-3">
      <order-status :status="order.payment_status"></order-status>
      <order-status :status="order.status"></order-status>
    </div>
    <products-list :products="items"/>
    <span class="col-span-2 text-gray-400">{{ pluralForm(countItems(items),['товар', 'товара', 'товаров']) }} на сумму {{ countPrice(items) }} ₽</span>
  </router-link>
</template>