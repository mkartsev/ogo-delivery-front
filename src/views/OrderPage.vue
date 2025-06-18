<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { useRoute }                 from 'vue-router'
  import { useDeliveriesStore }       from '@/stores/deliveries.store'
  import { useHeaderStore }           from '@/stores/header.store'
  import { api }                      from '@/services/api.service'
  import { findObjectByKey }          from '@/helpers'
  import { CogIcon }                  from '@/components/ui/icons'
  import Swal                         from 'sweetalert2'

  const headerStore = useHeaderStore()
  const deliveriesStore = useDeliveriesStore()
  const route = useRoute()

  const deliveryUID = computed(() => route.params.deliveryUID)
  const orderUID = computed(() => route.params.orderUID)

  deliveriesStore.checkDeliveries()

  const order = computed(() => findObjectByKey(deliveriesStore.deliveries, "uid", orderUID.value))
  
  let items = ref([])
  let paymentResult = ref({})
  const { loading, submitting } = api

  onMounted(
    () => {
      if (order.value) {
        items.value = JSON.parse(JSON.stringify(order.value.items))
        items.value.forEach(item => {
          Object.assign(item, {'checked': item.quantity > 0, 'maxquantity': item.quantity})
        })
        headerStore.setHeaderTitle(`Заказ #${order.value.id}`)
      }
    }
  )

  const orderPrice = computed(() => {
    return items.value.reduce((acc, obj) => {
      acc += obj.price * obj.quantity
      return acc
    }, 0)
  })

  const orderHeaderColor = computed(() =>{
    switch (order.value.status) {
      case "DELIVERY":
        return "bg-yellow-50"
      case "SHIPPED":
        return "bg-green-50"
      case "CANCELLED":
        return "bg-red-50"
      default:
        return ""
    }
  });

  const orderTextColor = computed(() => {
    switch (order.value.status) {
      case "DELIVERY":
        return "text-yellow-400"
      case "SHIPPED":
        return "text-green-500"
      case "CANCELLED":
        return "text-red-500"
      default:
        return ""
    }
  });

  const orderStatus = computed(() => {
    switch (order.value.status) {
      case "DELIVERY":
        return "Доставка заказа"
      case "SHIPPED":
        return "Заказ выдан клиенту"
      case "CANCELLED":
        return "Клиент отказался от заказа"
      default:
        return ""
    }
  });

  const paymentStatus = computed(() => {
    switch (order.value.payment_status) {
      case "UNPAYED":
        return "❌ Не оплачен"
      case "PAYED":
        return "✅ Оплачен"
      case "PROCESSING":
        return "⏳ В процессе"
      default:
        return ""
    }
  });

  const paymentType = computed(() => {
    switch (order.value.payment_type) {
      case "CASH":
        return "💵 Наличные"
      case "TRANSFER":
        return "💸 Перевод"
      case "CARD":
        return "💳 Банковская карта"
      default:
        return ""
    }
  });

  const itemDisabled = computed(() => {
    if (order.value.payment_status == 'UNPAYED' && order.value.payment_type == 'CASH' && order.value.status != 'CANCELLED') {
      return false
    }
    return true
  });

  function showPaymentConfirm(price) {
    price = orderPrice.value
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: 'Оплата',
      html: `Получено ${price}&nbsp;₽<br>Выбить чек?`,
      buttonsStyling: false,
      showDenyButton: true,
      confirmButtonText: 'Да',
      denyButtonText: 'Нет',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl',
        actions: 'flex !w-full gap-4 px-4',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-red-500 rounded-xl text-center text-lg text-white font-semibold',
        denyButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        htmlContainer: '!leading-relaxed',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        createPayment()
      } else if (result.isDenied) {
        console.log('Не оплачиваем заказ')
      }
    })
  }

  function showCancelConfirm() {
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: 'Клиент отказался от заказа?',
      buttonsStyling: false,
      showDenyButton: true,
      confirmButtonText: 'Да',
      denyButtonText: 'Нет',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl',
        actions: 'flex !w-full gap-4 px-4',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-red-500 rounded-xl text-center text-lg text-white font-semibold',
        denyButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        htmlContainer: '!leading-relaxed',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrder()
      } else if (result.isDenied) {
        console.log('Не отказался от заказа')
      }
    })
  }

  function showShipConfirm() {
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: 'Заказ передан клиенту?',
      buttonsStyling: false,
      showDenyButton: true,
      confirmButtonText: 'Да',
      denyButtonText: 'Нет',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl',
        actions: 'flex !w-full gap-4 px-4',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-red-500 rounded-xl text-center text-lg text-white font-semibold',
        denyButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        htmlContainer: '!leading-relaxed',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        shipOrder()
      } else if (result.isDenied) {
        console.log('Заказ не выдан')
      }
    });
  }

  function shipConfirmed() {
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: '🚛 Заказ доставлен',
      buttonsStyling: false,
      showDenyButton: false,
      confirmButtonText: 'ОК',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl',
        actions: 'flex !w-full gap-4 px-4',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-green-500 rounded-xl text-center text-lg text-white font-semibold',
        denyButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        htmlContainer: '!leading-relaxed',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('🚛 Заказ доставлен');
      }
    });
  }

  function cancelConfirmed() {
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: '🚚 Клиент отказался от заказа',
      buttonsStyling: false,
      showDenyButton: false,
      confirmButtonText: 'ОК',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl',
        actions: 'flex !w-full gap-4 px-4',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-red-500 rounded-xl text-center text-lg text-white font-semibold',
        denyButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        htmlContainer: '!leading-relaxed',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('🚚 Клиент отказался от заказа');
      }
    });
  }

  function showReceipt(receipt) {
    Swal.fire({
      width: '325px',
      color: '#212121',
      title: `Чек по заказу #${order.value.id}`,
      imageUrl: receipt,
      buttonsStyling: false,
      showDenyButton: false,
      confirmButtonText: 'Закрыть',
      customClass: {
        popup: '!p-6 !rounded-xl',
        title: '!text-2xl order-1',
        confirmButton: 'flex grow shrink-0 px-5 py-4 bg-gray-300 rounded-xl text-center text-lg text-neutral-900 font-semibold',
        image: 'order-2',
        actions: 'flex !w-full gap-4 px-4 order-3',
      }
    })
  }

  async function createPayment() {
    await api.createPayment(deliveryUID.value, orderUID.value, items.value)
    .then(
      response => {
        paymentResult.value = response.data
        order.value.payment_status = "PAYED"
        getReceipt();
      },
      reject => {
        console.log(reject)
      }
    )
  }

  async function cancelOrder() {
    await api.cancelOrder(deliveryUID.value, orderUID.value)
    .then(
      () => {
        order.value.status = 'CANCELLED'
        cancelConfirmed()
      },
      reject => {
        console.log(reject)
      }
    )
  }

  async function shipOrder() {
    await api.shipOrder(deliveryUID.value, orderUID.value, null)
    .then(
      () => {
        order.value.status = 'SHIPPED'
        shipConfirmed()
      },
      reject => {
        console.log(reject)
      }
    )
  }

  async function getReceipt() {
    await api.getReceipt(deliveryUID.value, orderUID.value)
    .then(
      response => {
        const receipt = 'data:image/png;base64, ' + response.data.qrcode
        showReceipt(receipt)
      },
      reject => {
        console.log(reject)
      }
    )
  }

  const handleChecked = (event, index) => {
    items.value[index].quantity = event.target.checked ? items.value[index].maxquantity : 0
  }

  const handleQuantity = (event, index) => {
    items.value[index].checked = !event.target.value ? false : true
  }

  const buttonDisabled = () => {
    if ( loading.value || submitting.value || order.value.status == 'CANCELLED' || order.value.status == 'SHIPPED' || order.value.payment_status == 'PROCESSING' ) {
      return true
    } 
    return false
  }
</script>

<template>
  <article v-if="order">
    <header :class="'order-header py-4 px-6 ' + orderHeaderColor">
      <h1 :class="'text-md font-semibold ' + orderTextColor">{{ orderStatus }}</h1>
    </header>
    <form>
      <section v-if="items" class="order-items">
        <div v-for="(item, index) in items" :key="item.uid" class="border-b border-solid border-y-gray-200 py-5 px-6">
          <div class="field">
            <input type="checkbox" :id="item.sku" v-model="items[index].checked" @change="handleChecked($event, index)" :disabled="itemDisabled" />
            <label :for="item.sku">{{ item.name }}</label>
          </div>
          <div class="flex items-center justify-between pl-9">
            <select 
              v-model="items[index].quantity" 
              @change="handleQuantity($event, index)" 
              class="flex w-24 rounded-lg bg-gray-100 py-1 pl-4 pr-10 border-0"
              :disabled="itemDisabled"
            >
              <option 
                v-for="quantity in items[index].maxquantity" 
                :key="quantity" 
                :value="quantity"
                class="text-gray-700"
              >
                {{ quantity }} шт
              </option>
            </select>
            <span class="text-xl font-medium">{{ item.price * item.quantity }}&nbsp;₽</span>
          </div>
        </div>
      </section>

      <section class="border-b border-solid border-y-gray-200 py-4 px-6">
        <div class="flex justify-between">
          <span class="text-lg">Сумма к оплате:</span>
          <span class="text-right text-xl font-medium text-red-500">{{ orderPrice }}&nbsp;₽</span>
        </div>
      </section>

      <section class="space-y-4 border-b border-solid border-y-gray-200 py-3 px-6">
        <div class="flex justify-between">
          <span>Статус:</span>
          <span class="text-right">{{ paymentStatus }}</span>
        </div>
        <div class="flex justify-between">
          <span>Способ оплаты:</span>
          <span class="text-right">{{ paymentType }}</span>
        </div>
      </section>

      <div class="grid grid-cols-2 gap-4 p-6">
        <button
          type="button"
          @click="order.payment_status == 'PAYED' ? showShipConfirm() : showPaymentConfirm()"
          :disabled="buttonDisabled()"
          class="flex items-center justify-center rounded-2xl bg-red-500 px-5 py-4 text-center text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-red-200"
        >
          <span v-show="loading || submitting" class="mr-1">
            <CogIcon class="h-6 w-6 motion-safe:animate-spin" />
          </span>
          {{ order.payment_status == 'PAYED' ? 'Выдать' : 'Оплатить' }}
        </button>
        <button
          type="button"
          @click="showCancelConfirm()"
          :disabled="buttonDisabled()"
          class="flex items-center justify-center rounded-2xl bg-gray-300 px-5 py-4 text-center text-lg font-semibold text-neutral-900 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-neutral-400"
        >
          <span v-show="loading || submitting" class="mr-1">
            <CogIcon class="h-6 w-6 motion-safe:animate-spin" />
          </span>
          Отказ
        </button>
      </div>
    </form>
  </article>
</template>

<style lang="scss">
  input {
    &[type="checkbox"],
    &[type="radio"] {
      position: absolute;
      width: 1px;
      height: 1px;
      top: calc(50% - 1px);
      left: 12px;
      opacity: 0;
      visibility: hidden;

      + label {
        display: block;
        position: relative;
        min-height: 25px;
        line-height: 25px;
        margin-bottom: 1rem;
        padding-left: 36px;

        &:hover {
          cursor: pointer;
        }

        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 25px;
          height: 25px;
          border: 1px solid #bdbdbd;
          border-radius: 4px;
          background: white;
        }

        &:after {
          content: "";
          position: absolute;
          width: 13px;
          height: 24px;
          left: 6px;
          top: 1px;
          color: transparent;
        }
      }

      &:checked + label {
        &:before {
          border-color: #f0434e;
          background-color: #f0434e;
        }

        &:after {
          content: url('data:image/svg+xml;charset=utf-8,<svg width="13" height="11" viewBox="0 0 13 11" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11.0074 0.614756C11.2275 0.405207 11.5204 0.28936 11.8243 0.29166C12.1282 0.293959 12.4193 0.414225 12.6362 0.62708C12.8531 0.839935 12.9788 1.12873 12.9869 1.43253C12.9949 1.73632 12.8846 2.03136 12.6792 2.25538L6.44486 10.0523C6.33766 10.1677 6.20827 10.2604 6.06444 10.3247C5.92061 10.389 5.76528 10.4237 5.60775 10.4266C5.45022 10.4295 5.29372 10.4006 5.1476 10.3417C5.00149 10.2827 4.86876 10.1949 4.75736 10.0835L0.622982 5.94913C0.507846 5.84185 0.415499 5.71247 0.351449 5.56872C0.287399 5.42497 0.252959 5.2698 0.250182 5.11245C0.247406 4.9551 0.276351 4.7988 0.33529 4.65288C0.394229 4.50697 0.481955 4.37441 0.593235 4.26313C0.704514 4.15185 0.837067 4.06413 0.982986 4.00519C1.1289 3.94625 1.2852 3.91731 1.44255 3.92008C1.5999 3.92286 1.75507 3.9573 1.89882 4.02135C2.04257 4.0854 2.17195 4.17775 2.27923 4.29288L5.55111 7.56319L10.9777 0.649131C10.9874 0.637101 10.9979 0.625625 11.0089 0.614756H11.0074Z"/></svg>');
          color: white;
        }
      }
      &:disabled + label {
        &:before {
          border-color: #f7f7f7;
          background-color: #f7f7f7;
        }
        &:after {
          content: url('data:image/svg+xml;charset=utf-8,<svg width="13" height="11" viewBox="0 0 13 11" fill="%239E9E9E" xmlns="http://www.w3.org/2000/svg"><path d="M11.0074 0.614756C11.2275 0.405207 11.5204 0.28936 11.8243 0.29166C12.1282 0.293959 12.4193 0.414225 12.6362 0.62708C12.8531 0.839935 12.9788 1.12873 12.9869 1.43253C12.9949 1.73632 12.8846 2.03136 12.6792 2.25538L6.44486 10.0523C6.33766 10.1677 6.20827 10.2604 6.06444 10.3247C5.92061 10.389 5.76528 10.4237 5.60775 10.4266C5.45022 10.4295 5.29372 10.4006 5.1476 10.3417C5.00149 10.2827 4.86876 10.1949 4.75736 10.0835L0.622982 5.94913C0.507846 5.84185 0.415499 5.71247 0.351449 5.56872C0.287399 5.42497 0.252959 5.2698 0.250182 5.11245C0.247406 4.9551 0.276351 4.7988 0.33529 4.65288C0.394229 4.50697 0.481955 4.37441 0.593235 4.26313C0.704514 4.15185 0.837067 4.06413 0.982986 4.00519C1.1289 3.94625 1.2852 3.91731 1.44255 3.92008C1.5999 3.92286 1.75507 3.9573 1.89882 4.02135C2.04257 4.0854 2.17195 4.17775 2.27923 4.29288L5.55111 7.56319L10.9777 0.649131C10.9874 0.637101 10.9979 0.625625 11.0089 0.614756H11.0074Z"/></svg>');
          color: white;
        }
        &:hover {
          cursor: default;
        }
      }
    }
    &[type="radio"] {
      + label {
        &:before {
          border-radius: 50%;
        }
      }
    }
  }
  .field {
    position: relative;
  }
</style>
