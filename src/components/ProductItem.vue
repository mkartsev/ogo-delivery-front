<script setup>
  defineProps({
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    maxquantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    }
  })
  defineEmits(['checked', 'update:quantity'])
</script>

<template>
  <div class="border-b border-solid border-y-gray-200 py-5 px-6">
    <div class="field">
      <input type="checkbox" :id="sku" @change="$emit('checked')" :disabled="disabled"/>
      <label :for="sku">{{ name }}</label>
    </div>
    <div class="flex items-center justify-between pl-9">
      <!-- <select :name="`${sku}_quantity`" :id="`${sku}_quantity`" v-model="quantity" @change="$emit('change')" :disabled="disabled">
        <option v-for="quantity in maxquantity" :key="quantity" :value="quantity">{{ quantity }}</option>
      </select> -->
      <select :name="`${sku}_quantity`" :id="`${sku}_quantity`" :value="quantity" @change="$emit('update:quantity', $event.target.value)" :disabled="disabled">
        <option v-for="quantity in maxquantity" :key="quantity" :value="quantity">{{ quantity }}</option>
      </select>
      <span class="text-xl font-medium">{{ price * quantity }}&nbsp;₽</span>
    </div>
  </div>
</template>