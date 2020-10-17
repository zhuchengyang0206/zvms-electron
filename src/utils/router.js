import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import me from '../views/me.vue'
import logout from '../views/logout.vue'
import * as classes from '../views/class'
//import admin from '../views/admin.vue'
//import about from '../views/about.vue'
//import error404 from '../views/error404.vue'
//import * as activity from '../views/activity'
//import * as user from '../views/user'
//import * as group from '../views/group'
//import store from './store'

Vue.use(Router)

export default new Router({
  routes: [
    // 首页
    {
      path: '/',
      //redirect: 'login',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/me',
      name: 'me',
      component: me
    },
    {
      path: '/logout',
      name: 'logout',
      component: logout
    },
    {
      path: '/class/list',
      component: classes.list
    },
    {
      path: '/class/stulist/:classid',
      component: classes.stulist
    }
    /*    // 用户相关
        {
          path: '/my',
          name: 'my',
          component: user.show,
          beforeEnter: (to, from, next) => {
            if (store.state.token) {
              return next()
            }
            return next('login')
          },
          props: () => ({
            id: store.state.profile.id
          })
        },
        {
          path: '/users',
          component: user.list
        },
        {
          path: '/users/show/:id',
          component: user.show,
          props: true
        },
        {
          path: '/users/create',
          component: user.create
        },
        // 班级
        {
          path: '/groups',
          component: group.list
        },
        {
          path: '/groups/create',
          component: group.create
        },
        // 登录
        {
          path: '/login',
          name: 'login',
          component: login,
          beforeEnter: (to, from, next) => {
            if (store.state.token) {
              return next(false)
            }
            return next()
          }
        },
        // 管理（制作中）
        {
          path: '/admin',
          name: 'admin',
          component: admin
        },
        // 关于
        {
          path: '/about',
          name: 'about',
          component: about
        },
        // 活动相关
        {
          path: '/activities',
          name: 'activities',
          component: activity.list
        },
        {
          path: '/activities/create',
          component: activity.create
        },
        {
          path: '/activities/show/:id',
          component: activity.show,
          props: true
        },
        // 404
        {
          path: '*',
          name: 'error404',
          component: error404
        }*/
  ]
})