<script setup>
  import { reactive, ref, watchEffect } from 'vue'
  import { useRoute }                   from 'vue-router'
  import { storeToRefs }                from "pinia"
  import { router }                     from "@/router"
  import { useUserStore }               from '@/stores/user.store'
  import { useHeaderStore }             from '@/stores/header.store'
  import { ArrowLeftIcon, LogoutIcon }  from "@/components/ui/icons"

  const userStore = useUserStore()
  const headerStore = useHeaderStore()

  const route = useRoute()

  const { user } = storeToRefs(userStore)
  const { headerTitle } = storeToRefs(headerStore)
  const back = ref(false)
  const logout = ref(false)
  const headerButtons = reactive({ back, logout })

  watchEffect(() => {
    headerButtons.back = !!user.value && route.path != '/deliveries'
    headerButtons.logout = !!user.value && route.path == '/deliveries'
  })

  function goBack() {
    router.go(-1)
  }

</script>

<template>
  <header v-if="user" class="header p-2 bg-red-500 text-white items-center flex justify-between">
    <div class="header-left">
      <button type="button" v-if="headerButtons.back" @click="goBack()" class="text-white hover:text-white">
        <i class="header__icon"><ArrowLeftIcon size="1.5x" /></i>
      </button>
    </div>
    <div class="header-center">
      <h1 class="text-center text-xl font-semibold" id="header-title" v-if="headerTitle">{{ headerTitle }}</h1>
    </div>
    <div class="header-right">
      <button type="button" v-if="headerButtons.logout" @click="userStore.logout()" class="text-white hover:text-white hover:cursor-pointer">
        <i class="header__icon"><LogoutIcon size="1.5x" /></i>
      </button>
    </div>
  </header>
</template>

<style lang="scss">
  .header-left,
  .header-right {
    min-width: 40px;
    min-height: 40px;
  }
  .header__icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 10px;
  }
</style>