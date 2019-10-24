import Vue from 'vue'
import VueRouter from 'vue-router'
import OrderList from '@/pages/OrderList'
import AddOrder from '@/pages/AddOrder'
import MRPDetail from '@/pages/OrderDetail'
import HelloWorld from '@/pages/HelloWorld'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/OrderList',
      name: 'OrderList',
      component: OrderList,
      meta: {requireAuth: false}
    },
    {
      path: '/AddOrder',
      name: 'AddOrder',
      component: AddOrder,
      meta: {requireAuth: false}
    },
    {
      path: '/MRPDetail',
      name: 'MRPDetail',
      component: MRPDetail,
      meta: {requireAuth: false}
    },
    {
      path: '/HelloWorld',
      name: 'OrderLHelloWorldist',
      component: HelloWorld,
      meta: {requireAuth: false}
    }
  ]
})

// 登录控制
router.beforeEach((to, from, next) => {
  next()
  // if (to.meta.requireAuth) {
  //   if (getCookie('ZTC_18a808c40bba58c2c')) {
  //     next()
  //   } else {
  //     localStorage.clear()
  //     next({
  //       path: '/Login'
  //     })
  //   }
  // } else {
  //   next()
  // }
})

export default router
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
