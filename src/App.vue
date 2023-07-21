<template>
	<div class="row justify-content-center page-container">
		<div class="col-sm-5 col-md-4 col-lg-4 col-xl-3 col-xxl-3 col-sm-5" v-if="$user.profile">
			<Profile></Profile>	
		</div>				
		<div class="col-sm-5 col-md-8 col-lg-8 col-xl-9 col-xxl-9 col-sm-5" :class="{ 'login-page': !$user.profile }" style="padding-right: 100px;">
			<router-view v-slot="{ Component, route }">
				<component v-if="!$user.profile" :is="Component" :key="route.path" @open-modal="openModal" :walletAddress="walletAddress" />
				<component v-else :is="Component" :key="route.path" />
			</router-view>
		</div>
	</div>			
	<!--web3-modal ref="web3modal" :theme="theme" :provider-options="providerOptions" cache-provider /-->
</template>

<style lang="scss" scoped>	
	.login-page {
		width: 100%;
		padding: 0px !important;
	}
</style>

<script>
	import Header from '@/views/partials/Header.vue';
	import Profile from '@/views/partials/Profile.vue'
	import Login from '@/views/partials/Login.vue'

	import { web3Store } from '@/store/web3.store'
	import { userStore } from '@/store/user.store'
	import { mapState } from 'pinia';
	import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
	import { Web3Modal } from '@web3modal/html'
	import { configureChains, createConfig, readContract, waitForTransaction } from '@wagmi/core'
	import { goerli } from '@wagmi/core/chains'

	const chains = [goerli]
	const projectId = WALLET_CONNECT_PR_ID
	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
	
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, version: 1, chains }),
		publicClient
	})
	const ethereumClient = new EthereumClient(wagmiConfig, chains)
	

	export default {
		name: "App",
		components: { Header, Profile, Login }, 
		data() {
			return {
				timeUpdateIndex: 0,			
				loaded: false,
				walletAddress: null
			};
		},

		computed: {
			...mapState(web3Store, ['account']),
		},

		async mounted() {
			const self = this

			this.$mitt.on("tx::swall", this.txResultSwall);
			this.$mitt.on("web3::updated", this.updateContractData);
			this.$mitt.on("profile::update", this.updateContractData);
			
			this.sockets.subscribe('TRANSFER', this.emitTransfer)
			this.sockets.subscribe('TRANSFER_COLLECT', this.emitTransferCollect)
			this.sockets.subscribe('DELETE', this.emitDelete)

			web3Store().setClient(ethereumClient)
						
			ethereumClient.watchNetwork(network => {
				web3Store().setChain(network.chain)
			})
			
			ethereumClient.watchAccount(account => {				
				web3Store().setAccount(account)				
			})

			const web3modal = new Web3Modal({ projectId }, ethereumClient)
			web3Store().setWeb3Modal(web3modal)
							
			this.$web3.updateTimestamp();
			setTimeout(async function tick() {
				self.$mitt.emit('timer:tick')
				if (self.timeUpdateIndex >= 10) {
					self.$web3.updateTimestamp();					
					self.timeUpdateIndex = 0
				} else {
					self.timeUpdateIndex ++
				}	
				
				if (self.$user.auth && !self.$web3.account?.address) {
					await self.$user.logout()
				}
				setTimeout(tick, 1000);     
			}, 1000)
			
		},

		watch: {			
			"$web3.account.address": {
				async handler(newValue, oldValue) {
					if (newValue) {
						this.walletAddress = newValue;
						if (this.$user.auth?.address?.toLowerCase() === newValue.toLowerCase()) {
							if(!this.$user.profile) await this.$user.getProfile()
							if(this.$route.name === 'login') {
								this.$router.push({ name: 'publications' }) 
							}
						} else {
							await this.$user.logout()
						}
						this.$mitt.emit('web3::updated')											
					}
				}
			}
		},
		
		methods: {
			emitTransfer(token){
				this.$mitt.emit('transfer::token', token)
			},
			emitTransferCollect(publication){
				this.$mitt.emit('transfer::collect', publication)
			},
			emitDelete(id){
				this.$mitt.emit('item::delete', id)
			},
			
			async updateContractData() {		
				try {
					if (this.$web3.account?.address) {
						console.log('this.$web3.fanaticoHub', this.$web3.fanaticoHub)

						const aggregatedData = await readContract({
							...this.$web3.fanaticoHub,
							functionName: 'aggregatedData',	
							args: [this.$web3.account.address]					
						})

						this.$web3.setFanaticoHubConfig({
							feeBase: aggregatedData[0],
							serviceFee: aggregatedData[1],
						})	
						this.$user.setWallet({
							//ethBalance: BigInt(1276318275897000) //aggregatedData[2]// BigInt(1234567890000000000)// ,
							ethBalance: aggregatedData[2]// BigInt(1234567890000000000)// ,
						})							
					}						
				} catch (error) {
					console.log(error)
				}
			},		

			async txResultSwall({ hash, msg, emit, callback }) {
				try {
					const result = await waitForTransaction({hash});
					if (callback) callback();
					if (emit) {
						this.gWait(1000)
						if (typeof emit === 'string') {
							this.$mitt.emit(emit);
						}
						if (Array.isArray(emit)) {
							emit.forEach(e => this.$mitt.emit(e))
						}						
					}
					if (result.status) {
						this.$swal({
							icon: "success",
							title: msg.title || "SUCCESS",
							text: msg.success || "Confirmation successful",
							timer: 6000,
          					showConfirmButton: true,
						});
					} else {
						this.$swal({
							icon: "error",
							title: msg.title || "ERROR",
							text: msg.nosuccess || "Confirmation error",
							timer: 3000
						});
					}
				} catch (error) {
					this.$swal({
						icon: "error",
						title: msg.title || "ERROR",
						text: "Error: " + (error.data?.message ? error.message + " ... " + error.data?.message : error.message),
						timer: 3000
					});
					console.error("txResultToast", error);
				}
			},
			openModal() {
                web3Store().web3Modal.openModal()
            }
		},
	};
</script>
	