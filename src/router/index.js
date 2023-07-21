import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/store/user.store'
import { web3Store } from '@/store/web3.store'
import Login from '@/views/partials/Login.vue'
import List from '@/views/list/List.vue'
const routes = [	
	{
		path: '/',
		name: 'home',
		redirect: '/publications',
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
	{
		path: '/publications',
		name: 'publications',
		props: { mode: 'pub' },	
		component: List,	
		//component: () => import('../views/list/List.vue'),
		meta: { auth: true },
	},
	{
		path: '/collection',
		name: 'collection',
		props: { mode: 'col' },	
		component: List,
		//component: () => import('../views/list/List.vue'),
		meta: { auth: true },
	},
	{
		path: '/explore',
		name: 'explore',	
		props: { mode: 'exp' },	
		component: List,
		//component: () => import('../views/list/List.vue'),
		meta: { auth: true },
	},	
	
	{ path: "/:pathMatch(.*)*", redirect: '/publications', }	
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

router.beforeEach(async (to, from, next) => {	
	if (to.meta.auth) {
		const user = userStore()
		if (user.auth) { // && web3.account
			next()
		} else {
			next({ name: 'login' })
		}
	} else {
		next()
	}
})

export default router

// // http://localhost:5173/mirrors?id=6400c7280cb4487ed312b15c
