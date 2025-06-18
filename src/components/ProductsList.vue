<script setup>
  import ProductItem from "@/components/ProductItem.vue"
  
  defineProps({
    products: {
      type: Array,
      required: true,
    }
  });
</script>

<template>
  <section class="order-items">
    <product-item v-for="product in products" 
      :item="product" 
      :key="product.uid" 
      :sku="product.sku"
      :name="product.name"
      :quantity="product.quantity"
      :maxquantity="product.maxquantity"
      :price="product.price"
      :disabled="product.disabled"
    />
  </section>
</template>