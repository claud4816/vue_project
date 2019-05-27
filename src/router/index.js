import Vue from 'vue'
import Router from 'vue-router'

// 路由引入
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const Welcome = () => import('@/components/Welcome.vue')
const User = () => import('@/components/User.vue')
const Rights = () => import('@/components/Rights.vue')
const Roles = () => import('@/components/Roles.vue')
const Cate = () => import('@/components/Cate.vue')
const Param = () => import('@/components/Param.vue')
const Orders = () => import('@/components/Order.vue')
const Goods = () => import('@/components/Goods.vue')
const GoodsAdd = () => import('@/components/GoodsAdd.vue')
const Reports = () => import('@/components/Reports.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    // 设置首页路由 显示为login页面
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Param },
        { path: '/orders', component: Orders },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/reports', component: Reports }
      ]
    }
  ]
})
// 设置路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  var token = window.sessionStorage.getItem('token')
  // 判断是否有token 判断当前路由是是login
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
