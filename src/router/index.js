import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import { HomePage, LoginPage, DeliveriesPage, DeliveryPage, OrderPage, NotFound, } from '@/views'

export const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes: [
    {
      path: "/", 
      component: HomePage,
      meta: {
        title: "ОГО! Доставка",
      },
    },
    {
      path: "/login", 
      component: LoginPage,
      meta: {
        title: "Вход",
      },
    },
    {
      path: "/deliveries", 
      component: DeliveriesPage, 
      meta: {
        title: "Доставки",
      },
    },
    {
      path: "/deliveries/:deliveryUID", 
      component: DeliveryPage, 
      meta: {
        title: "Адрес",
      },
    },
    {
      path: "/deliveries/:deliveryUID/orders/:orderUID", 
      component: OrderPage, 
      meta: {
        title: "Заказ",
      },
    },
    { 
      path: '/:pathMatch(.*)',
      component: NotFound,
      meta: {
        title: 'Страница не найдена',
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const { user } = useUserStore()
  const publicPages = ['/', '/login']
  const authRequired = !publicPages.includes(to.path)
  if (authRequired && !user) {
    next('/login')
  } else {
    window.document.title = to.meta.title
    next()
  }
})