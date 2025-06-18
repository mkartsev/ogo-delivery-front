<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    status: {
      type: String,
      required: true
    },
    baseClass: {
      type: String,
      default: "py-1 px-3 text-center text-xs uppercase font-bold border rounded-full"
    }
  })
  const title = computed(() => {
    switch (props.status) {
      case "PAYED":
        return "Оплачен";
      case "UNPAYED":
        return "Не оплачен";
      case "PROCESSING":
        return "В процессе";
      case "DELIVERY":
        return "Доставка";
      case "SHIPPED":
        return "Выдан";
      case "CANCELLED":
        return "Отказ";
      default:
        return "";
    }
  })
  const color = computed(() => {
    switch (props.status) {
      case "PAYED":
        return "border-green-500";
      case "UNPAYED":
        return "border-neutral-500";
      case "PROCESSING":
        return "border-neutral-500";
      case "DELIVERY":
        return "text-white bg-yellow-300";
      case "SHIPPED":
        return "text-white bg-green-500";
      case "CANCELLED":
        return "text-white bg-red-500";
      default:
        return "";
    }
  })
</script>

<template>
  <span :class="[baseClass, color]">{{ title }}</span>
</template>
