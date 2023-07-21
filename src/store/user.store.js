import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import router from '@/router';
import { api } from '@/api/api'
import { defineStore } from 'pinia';
import { web3Store } from "./web3.store.js";
import { signMessage } from '@wagmi/core'
 
export const userStore = defineStore('user', {
	state: () => ({
		userData: null,
		walletData: null,
		authData: JSON.parse(localStorage.getItem(APP_NAME))			
	}),

	getters: {
		auth: (state) => state.authData,
		profile: (state) => state.userData,		
		wallet: (state) => state.walletData,				
		profilePictureUrl: () => {
			return function (url) {				
				if (!url) return '/img/profile.webp'				
				if (url.includes('ipfs')) {
					return url.replace('ipfs://', 'https://fanatico.infura-ipfs.io/ipfs/')
				}
				return url	
			}
		},
		getLocale: () => navigator?.languages?.length ? navigator.languages[0] : navigator.language,
	},

	actions: {		
		async getUser() {	
			try {
				const userResp = await api.get('/user');
				this.userData = userResp.data.user;
			} catch (error) {
				this.userData = null
			}	
		},
		async getData() {	
			try {
				//const userDataResp = await api.get('/user/getData');				
			} catch (error) {				
			}	
		},
		
		async setWallet(wallet) {	
			this.walletData = wallet 
		},

		async setUser(user) {	
			this.userData = user 
		},
		
		
		async getProfile() {
			this.userData = (await api.get('/user')).data.user
		},

		async updateProfile() {
			await api.post('/user/updateProfile')
		},
		
		async login() {
			const web3 = web3Store()
			const address = web3.account.address;
			const { msg, uid } = (await api.get('/auth', { params: { address }})).data
			
			const signature = await signMessage({ message: msg + uid });						
			const login = await api.post('/auth', { signature, uid })

			this.setAuth(login.data.auth);
			this.userData = login.data.user;
						
			try { 
				router.push({ name: 'publications' }) 
			} catch (error) { console.log(error) }
		},

		async logout() {						
			try {
				if (this.authData?.refreshToken)
					await api.post('/auth/logout', { refreshToken: this.authData.refreshToken })
			} catch (error) { console.log(error) }	

			this.authData = null;
			this.userData = null;
			this.walletData = null;
			
			localStorage.removeItem(APP_NAME);

			//web3Store().disconnect()

			localStorage.removeItem('lit-comms-keypair');
            localStorage.removeItem('lit-auth-signature');
            localStorage.removeItem('lit-web3-provider');

			try { 				
				router.push({ name: 'login' }) 	
				//location.reload()			
			} catch (error) { 
				console.log(error) 				
			}
						
		},

		setAuth(auth) {
			var accessTokenDecoded = jwt_decode(auth.accessToken);
			var refreshTokenDecoded = jwt_decode(auth.refreshToken);
			this.authData = {
				accessToken: auth.accessToken,
				refreshToken: auth.refreshToken,
				accessTokenExpires: dayjs(accessTokenDecoded.exp * 1000), //dayjs().add(60, 'second'),
				refreshTokenExpires: dayjs(refreshTokenDecoded.exp * 1000), // dayjs().add(180, 'second'),		
				address: auth.address,	
			}
			
			localStorage.setItem(APP_NAME, JSON.stringify(this.authData));
			return this.authData
		},
	},
});
