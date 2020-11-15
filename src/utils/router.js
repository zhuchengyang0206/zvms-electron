import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home.vue'
import login from '../views/login.vue'
import me from '../views/me.vue'
import logout from '../views/logout.vue'
import * as classes from '../views/class'
import * as volunteer from '../views/volunteer'
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
			name: 'classList',
			component: classes.list
		},
		{
			path: '/class/stulist/:classid',
			name: 'classStulist',
			component: classes.stulist
		},
		{
			path: '/volunteer/list',
			name: 'volunteerList',
			component: volunteer.list
		}
	]
})
