<script setup>
  import { computed }             from 'vue'
  import { useRoute }             from 'vue-router'
  import { useDeliveriesStore }   from '@/stores/deliveries.store'
  import { findObjectByKey }      from '@/helpers'
  import OrdersList               from '@/components/OrdersList.vue'
  import { RouteIcon, PhoneIcon } from '@/components/ui/icons'

  const deliveriesStore = useDeliveriesStore()
  const route = useRoute()

  const deliveryUID = computed(() => route.params.deliveryUID)

  deliveriesStore.checkDeliveries()

  const delivery = computed(() => {
    return findObjectByKey(deliveriesStore.deliveries, "uid", deliveryUID.value)
  })

  const yandexMap = computed(() => {
    const address = delivery.value.address.address
    const coords = `${delivery.value.address.long},${delivery.value.address.lat}`
    const point = (delivery.value.address.long && delivery.value.address.lat) ? coords : address
    return `https://yandex.ru/maps/?pt=${point}&z=18&l=map`
  })

  const ordersSum = computed(() => {
    return delivery.value.orders.reduce((sum, order) => {
      return sum + order.items.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)
    }, 0)
  })
</script>

<template>
  <article v-if="delivery" class="border-b border-b-gray-200">
    <header class="py-4 px-6">
      <h1 class="text-neutral-800 text-2xl font-semibold">{{ delivery.address.address }}</h1>
    </header>

    <address class="not-italic pt-4 pb-6 px-6 border-solid border-y border-y-gray-200">
      <dl class="mb-4">
        <dt class="text-gray-400 text-xs">Покупатель:</dt>
        <dd class="mb-3 text-lg">{{ delivery.name }}</dd>
        <dt class="text-gray-400 text-xs">Телефон:</dt>
        <dd class="mb-3 text-lg">{{ delivery.phone }}</dd>
        <dt class="text-gray-400 text-xs">Комментарий:</dt>
        <dd v-if="delivery.comment" class="mb-3 text-lg">{{ delivery.comment }}</dd>
      </dl>
      <div class="grid grid-cols-2 gap-4">
        <a :href="`tel:${ delivery.phone }`" class="flex justify-center items-center gap-2 px-5 py-4 border border-red-500 rounded-2xl text-center text-neutral-900 font-medium">
          <i class="icon text-red-500"><PhoneIcon size="1.5x"/></i>
          Позвонить
        </a>
        <a :href="yandexMap" class="flex justify-center items-center gap-2 px-5 py-4 border border-red-500 rounded-2xl text-center text-neutral-900 font-medium" target="_blank">
          <i class="icon text-red-500"><RouteIcon size="1.5x"/></i>
          Маршрут
        </a>
      </div>
    </address>

    <section class="py-4 px-6">
      <orders-list :orders="delivery.orders" :links="true" :deliveryUID="delivery.uid"></orders-list>
    </section>

    <section class="py-4 px-6 border-solid border-t border-y-gray-200">
      <div class="flex justify-between">
        <span class="text-lg">Сумма к оплате:</span>
        <span class="text-xl text-right font-medium">{{ ordersSum }} ₽</span>
      </div>
    </section>
  </article>
</template>