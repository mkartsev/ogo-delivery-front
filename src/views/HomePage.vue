<script setup>
  import { router }       from '@/router'
  import { storeToRefs }  from 'pinia'
  import { useUserStore } from '@/stores/user.store'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)
  
  if (user.value) {
    router.push('/deliveries')
  } else {
    router.push('/login')
  }
</script>

<template>
  <section class="py-4 px-6">
    <h1>Привет, {{ user }}!</h1>
    <hr>
    <RouterView />
  </section>
</template>