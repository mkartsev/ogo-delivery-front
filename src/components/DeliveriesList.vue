<script setup>
  import { storeToRefs }        from 'pinia';
  import { useDeliveriesStore } from '@/stores/deliveries.store';
  import DeliveryItem           from '@/components/DeliveryItem.vue';

  const deliveriesStore = useDeliveriesStore();
  const { deliveries } = storeToRefs(deliveriesStore);

  // defineProps({
  //   deliveries: {
  //     type: Array,
  //     required: true,
  //   }
  // });
</script>

<template>
  <section v-if="deliveries" class="deliveries-list">
    <delivery-item v-for="delivery in deliveries" 
      :key="delivery.uid" 
      :uid="delivery.uid" 
      :address="delivery.address" 
      :orders="delivery.orders" 
    />
  </section>
</template>