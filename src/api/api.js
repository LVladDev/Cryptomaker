import axios from 'axios';
import dayjs from 'dayjs';
import { userStore } from "@/store/user.store.js";

const api = axios.create({
  baseURL: API_URL 
})

let refreshing = false

// Request interceptor for API calls
api.interceptors.request.use(
    async (config) => {
		config.headers["Accept"] = 'application/json'
		config.headers["Content-Type"] = 'application/json'
		
		if (config.data instanceof FormData) {
			config.headers["Content-Type"] = `multipart/form-data; boundary=${config.data._boundary}`;
		}

		const user = userStore()
				
		if (user.auth?.accessToken && dayjs(user.auth.accessTokenExpires).add(60, 'seconds') > dayjs()){
			//console.log(user.auth.api.accessToken)
			config.headers["Authorization"] = `Bearer ${user.auth.accessToken}`;
		} else {
			//const auth = await refreshToken();
			//config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
		}  

      	return config;
    },
    (error) => {      
      	Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {  			
		const originalRequest = error.config;
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
						
			const auth = await refreshToken();			
			
			if (auth) {				
				api.defaults.headers.common["Authorization"] = "Bearer " + auth.accessToken;				
				return api(originalRequest);
			} else {				
				//await userStore().logout();
			}
		} 		
		return Promise.reject(error?.response?.data || false);
	}
); 

const refreshToken = async function () {	
	refreshing = true
	const user = userStore()
	try {		
		const refreshResp = await api.post("auth/refresh", { refreshToken: user.auth.refreshToken })
		refreshing = false
		return user.setAuth(refreshResp.data.auth);					
	} catch (error) {			
		console.log('authRefreshToken fail');
		await user.logout();
		refreshing = false
		return null
	}		
};

setTimeout(async function tick() {
	const user = userStore()
	if (!refreshing && user.auth?.refreshToken && dayjs(user.auth.refreshTokenExpires).add(60, 'seconds') < dayjs()){
		////console.log('auth.refreshToken seconds', dayjs(auth.refreshTokenExpires).unix() - dayjs().unix());
		console.log('RefreshAccessToken TIMER');
		await refreshToken();
	}
	//console.log('API RefreshAccessToken TIMER');
	setTimeout(tick, 10000);
}, 0);

export { api };