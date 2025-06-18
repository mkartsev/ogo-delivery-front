import { ref }          from 'vue'
import { router }       from '@/router'
import { useUserStore } from '@/stores/user.store'
import { api }          from '@/services/api.service'

export const auth = {
  isCodeSent: ref(false),
  async getCode(username) {
    //username складывается из префикса и номера телефона
    api.sendPin(username)
    .then(
      () => {
        auth.isCodeSent.value = true;
      }
    )
  },
  async login(username, pin) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', pin);

    await api.postToken(params)
    .then(
      response => {
        const userStore = useUserStore()
        userStore.login(username, response.data.access_token);
        router.push('/deliveries');
      }
    )
  },
  logout() {
    // Логаут из хранилища пользователя
    // Неплохо бы еще завершение сессии отсылать
    const userStore = useUserStore()
    userStore.logout()
    router.push('/login');
  }
}