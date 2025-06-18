<script setup>
  // import { watch } from "vue"
  import TheHeader   from '@/components/TheHeader.vue'
  import { api }     from '@/services/api.service'
  import { CogIcon } from '@/components/ui/icons'

  const { loading, submitting, error } = api

  // watch (
  //   () => error,
  //   () => {
  //     if (error.value) {
        
  //     }
  //   }
  // )
</script>

<template>
  <div class="flex flex-col h-screen max-w-screen-sm mx-auto">
    <TheHeader />
    <div v-if="loading || submitting" class="fixed flex justify-center items-center w-full h-screen inset-0 bg-black/[.4] z-10">
      <CogIcon class="block h-10 w-10 text-neutral-50 motion-safe:animate-spin" />
    </div>
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
  @import '@/assets/css/base.css';
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-out;
  }
  .swal2-title {
    padding-right: 0;
    padding-left: 0;
  }
</style>