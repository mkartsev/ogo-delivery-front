import { ref, watch }  from 'vue'
import { defineStore } from 'pinia'
import { useRoute }    from 'vue-router'

export const useHeaderStore = defineStore("header", () => {
  const route = useRoute()

  let headerTitle = ref("")

  const setHeaderTitle = (title) => {
    headerTitle.value = title
  }

  watch(
    () => (route.meta.title), (state) => {
      setHeaderTitle(state)
    }
  )

  return {
    headerTitle, setHeaderTitle
  }
})