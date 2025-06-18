<script setup>
  import API_URL                                      from '@/settings'
  import { ref, computed }                            from 'vue'
  import { storeToRefs }                              from 'pinia'
  import { router }                                   from '@/router'
  import Axios                                        from 'axios'
  import { defineRule, useForm, Field, ErrorMessage } from 'vee-validate'
  import { CogIcon }                                  from '@/components/ui/icons'
  import { useUserStore }                             from '@/stores/user.store'

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { handleSubmit } = useForm();

  defineRule('required', value => {
    if (!value || !value.length) {
      return 'Заполните поле';
    }
    return true;
  });

  defineRule('phone', value => {
    if (!value || !value.length) {
      return true;
    }
    if (!/((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))$/.test(value)) {
      return 'Введите верный номер телефона';
    }
    return true;
  });

  const prefix       = 7;
  const phone        = ref('');
  const isCodeSent   = ref(false);
  const isSubmitting = ref(false);
  const countdown    = ref(60);

  const username = computed(() => {
    return '' + prefix + phone.value;
  });

  let pin = Array(4);
  let dataFromPaste;
  const keysAllowed = ["0","1","2","3","4","5","6","7","8","9"];
  
  function isNumber(event) {
    (event.currentTarget).value = "";
    const keyPressed = (event).key;
    if (!keysAllowed.includes(keyPressed)) {
      event.preventDefault();
    }
  }

  function handleInput(event) {
    const inputType = event.inputType;
    let currentActiveElement = event.target;
    if (inputType === "insertText") {
      currentActiveElement.nextElementSibling?.focus();
    }
    if (inputType === "insertFromPaste" && dataFromPaste) {
      for (const num of dataFromPaste) {
        let id = parseInt(currentActiveElement.id.split("_")[1]);
        currentActiveElement.value = num;
        pin[id] = num;
        if (currentActiveElement.nextElementSibling) {
          currentActiveElement =
            currentActiveElement.nextElementSibling;
          currentActiveElement.nextElementSibling?.focus();
        }
      }
    }
    // console.log(pin);
  }

  function handleDelete(event) {
    //keydown event = move to previous element then only delete number
    let value = (event.target).value;
    let currentActiveElement = event.target;
    if (!value) {
      currentActiveElement.previousElementSibling?.focus();
    }
  }

  function onPaste(event) {
    let dataFromPaste = event.clipboardData?.getData("text").trim().split("");
    if (dataFromPaste) {
      for (const num of dataFromPaste) {
        if (!keysAllowed.includes(num)) event.preventDefault();
      }
    }
  }

  function countDownTimer() {
    if(countdown.value > 0) {
      setTimeout(() => {
        countdown.value -= 1;
        countDownTimer()
      }, 1000)
    }
  }

  const handleSendCode = handleSubmit(() => {
    isSubmitting.value = true;
    countdown.value = 60;
    countDownTimer();
    return Axios
      .post(`${API_URL}/users/${username.value}/send_pin`)
      .then(
        () => {
          isCodeSent.value = true;
        },
        error => {
          console.log(error);
        }
      )
      .finally(() => {
        isSubmitting.value = false;
      });
  }, onInvalidSubmit);

  const handleLogin = handleSubmit(() => {
    isSubmitting.value = true;
    
    const params = new URLSearchParams();
    params.append('username', username.value);
    params.append('password', pin.join(''));

    return Axios
      .post(`${API_URL}/token`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(
        response => {
          userStore.login(username.value, response.data.access_token);
          router.push('/deliveries');
        },
        error => {
          console.log(error);
        }
      )
      .finally(() => {
        isSubmitting.value = false;
      });
  }, onInvalidSubmit);

  function onInvalidSubmit({ values, errors, results }) {
    // for (const key in errors) {
    //   document.querySelector(`[name=${key}]`).classList.add('outline-1', 'outline-red-500');
    // }
    console.log(values);  // current form values
    console.log(errors);  // a map of field names and their first error message
    console.log(results); // a detailed map of field names and their validation results
  }

  if (user.value) {
    router.push('/deliveries');
  }
</script>

<template>
  <section class="py-4 px-6">
    <div class="p-4">
      Телефон: 1113333333
      <br />
      PIN: 1234
    </div>

    <form v-if="!isCodeSent" @submit="handleSendCode">
      <div class="mb-10 text-center">
        <img src="/img/truck.svg" class="auth__logo my-4 mx-auto" alt="" />
        <h1 class="mb-6 text-3xl font-semibold">Авторизация</h1>
        <p>
          На ваш телефон будет отправлено
          <br />
          SMS с кодом подтверждения
        </p>
      </div>
      <div class="mb-5 grid grid-cols-[80px_minmax(min-content,_1fr)] gap-4">
        <div class="col">
          <input type="text" class="w-full rounded-2xl border-none bg-gray-50 py-6 px-5 text-center text-2xl disabled:text-gray-400" value="+7" disabled />
        </div>
        <div class="col">
          <Field type="tel" class="w-full rounded-2xl border-none bg-gray-50 py-6 px-5 text-2xl" name="phone" v-model="phone" rules="required|phone" placeholder="Телефон" />
          <ErrorMessage name="phone" />
        </div>
      </div>
      <button
        :disabled="isSubmitting"
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-solid bg-red-500 p-5 text-center text-lg font-semibold leading-none text-white transition duration-150 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:bg-red-200"
      >
        <span v-show="isSubmitting">
          <CogIcon size="1.5x" class="h-6 w-6 motion-safe:animate-spin" />
        </span>
        Отправить код
      </button>
    </form>

    <form v-if="isCodeSent" @submit="handleLogin">
      <div class="mb-10 text-center">
        <h1 class="mb-6 text-3xl font-semibold">Верификация</h1>
        <p>
          На номер +{{ prefix }}{{ phone }}
          <br />
          отправлен код подтверждения
        </p>
      </div>
      <div class="grid grid-cols-4 gap-4 w-4/5 mx-auto">
        <input
          v-for="(n, index) in pin"
          :key="index"
          type="number"
          pattern="\d*"
          :id="'input_' + index"
          maxlength="1"
          v-model="pin[index]"
          name="pin[index]"
          @input="handleInput"
          @keypress="isNumber"
          @keydown.delete="handleDelete"
          @paste="onPaste"
          class="w-full appearance-none rounded-2xl border-none bg-gray-50 py-6 px-5 text-3xl text-center"
        />
      </div>
      <div class="my-4 text-center">
        <p>Не получили код?</p>
        <p v-if="countdown > 0">Отправить повторно через {{ countdown }} секунд</p>
        <p v-else><button type="button" @click="handleSendCode()" class="text-blue-500 hover:text-blue-700">Отправить повторно</button></p>
      </div>
      <button
        :disabled="isSubmitting"
        class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-solid bg-red-500 p-5 text-center text-lg font-semibold leading-none text-white transition duration-150 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:bg-red-200"
      >
        <span v-show="isSubmitting">
          <CogIcon size="1.5x" class="h-6 w-6 motion-safe:animate-spin" />
        </span>
        Войти
      </button>
    </form>
  </section>
</template>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
