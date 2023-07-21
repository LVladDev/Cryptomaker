<template>
	<div v-if="$user.profile && $web3.account">
		<div class="row">
			<div class="d-flex align-items-center mb-2 col-md-3">
				<div v-if="mode === 'pub'" class="fs-4 fw-bold mt-4">Publications</div>  
				<div v-if="mode === 'col'" class="fs-4 fw-bold mt-4">My collection</div> 
				<div v-if="mode === 'exp'" class="fs-4 fw-bold mt-4">Explore</div> 
			</div>

			<div v-if="mode !== 'pub'" class="col-xl-4 offset-xl-5 col-md-7 offset-md-2 mb-2 mt-2 d-flex align-items-center">
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control search-input"
						placeholder="Search"
						aria-label="Search"
						v-model="query.search"
					/>
					<div class="input-group-append"  :style="{ width: '13%' }">
						<button class="btn search-btn btn-secondary" type="button" :style="{ width: '100%' }" @click="setPage(1)">
							<svg width="24" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" stroke-width="1.63623" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M21 21L16.65 16.65" stroke="white" stroke-width="1.63623" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
					</div>
				</div>
				<!-- <div class="_icon_search bg-primary pointer me-1 ms-2" ></div>	 -->
			</div>		
		</div>
        <div class="d-flex align-items-center justify-content-between mb-5">
			<div class="d-flex align-items-center search-filter" :style="{ width: '15%' }">
				<select class="form-select form-select-sm border-0 pointer fw-bold" v-model="query.sort" @change="setPage(1)">
					<option class="fw-bold " v-for="option in sortFilters" :value="option.value">
						{{ option.text }}
					</option>
				</select>				
				
				<select class="form-select form-select-sm border-0 pointer fw-bold" v-model="query.select" @change="setPage(1)" v-if="mode === 'pub' || mode === 'exp'">
					<option class="fw-bold " v-for="option in selectFilters" :value="option.value">
						{{ option.text }}
					</option>
				</select>					
			</div>
			
			<!-- <div class="d-flex align-items-center">
				<div class="_icon_reload bg-primary pointer me-1 ms-2" @click="get()"></div>				
			</div> -->
		</div>

		<div class="">
			<Item v-for="item in items" :mode="mode" :item="item" :key="item.id"/>
		</div>
        
        <div class="d-flex align-items-center justify-content-center mb-3 pagination" v-if="totalPages > 1">			
			<Paginate 
                :page-count="parseInt(totalPages)" 
                :click-handler="setPage"
				:force-page="parseInt(query.page)" 
                :prev-text="'...'" 
                :next-text="'...'">
			</Paginate>			
		</div>
	</div>	
</template>

<style lang="scss" scoped>
	.search-btn {
		border-radius: 0px 10px 10px 0px;
		background-color: #3DA4AC;
	}
	.search-input {
		background-color: #ADADAD;
		border: 1px #ADADAD solid;
		opacity: 0.6;
		border-radius: 10px 0px 0px 10px;
	}
	@media screen and (max-width: 1240px) {
		.search-filter {
			width: 30% !important;
		}
	}
	.search-filter select {
		color: #4D4E4E;
	}
	.pagination {
		float: right;
	}
</style>

<script>
	import { api } from '@/api/api'
	import Item from './Item.vue'
	import Paginate from '@/views/components/Paginate.vue'
	
	export default {
		components: {			
			Paginate,
			Item
		},
		props: {
			mode: { type: String, required: true },
		},	
		data() {
			return {
				items: [],
                query: {
                    page: 1,
                    limit: 2,
                    select: 'all',
                    id: null,
				},
                limitDefault: 2,
                totalPages: 0,
                totalResults: 0,										
			}
		},
		computed: {
			mediaUrl(){ return function (url) {                
				if (url.includes('ipfs')) {
					return url.replace('ipfs://', 'https://fanatico.infura-ipfs.io/ipfs/')
				}
                return url
            }},
			sortFilters() {
				return [
					{ text: 'Recent', value: 'desc' },
					{ text: 'Oldest', value: 'asc' },	
				]
			},
			selectFilters() {
				if (this.mode === 'pub') {
					return [
						{ text: 'All', value: 'all' },
						{ text: 'Purchased', value: 'purchased' },	
					]
				} 
				if (this.mode === 'col') {
					return [
						{ text: 'All', value: 'all' },
						{ text: 'Collected', value: 'collected' },	
						{ text: 'Readed', value: 'readed' },	
					]
				} 
				if (this.mode === 'exp') {
					return [
						{ text: 'Available', value: 'available' },
						{ text: 'All', value: 'all' },	
					]
				}				
			} 
		},
		watch: {
			"$user.profile.id": {
				handler(newValue) {
					if (newValue) {
						this.get()
					}
				}
			},
			"$web3.account.address": {
				handler(newValue) {
					if (newValue && this.$user.profile) {
						this.get()
					}
				}
			},
		},
		async mounted() {
			console.log('mounted')
			if(this.$web3.account?.address) {
				this.getQuery()            
				this.get()
				this.$mitt.on("campaigns::publications::reload", this.setPage)
				this.$mitt.on("campaigns::publications::add", this.addPublication)
				this.$mitt.on("campaigns::publications::delete", this.delletePublication)

				this.$mitt.on("transfer::token", this.transferToken)
				this.$mitt.on('transfer::collect', this.publicationUpdate)
				this.$mitt.on("item::lock", this.lockItem)
				this.$mitt.on("item::delete", this.publicationDelete)
				
				this.$mitt.on("search::by::user", this.searchByUser)	
			}
			
		},	
		beforeUnmount() {			
			this.$mitt.off("campaigns::publications::reload")
			this.$mitt.off("campaigns::publications::add")

			this.$mitt.off("collect::transfer")
			this.$mitt.off("item::lock")
			this.$mitt.off("search::by::user")
		},	
		methods: {
			searchByUser(address) {
				this.query.search = address
				this.setPage(1)
			},
			lockItem(data) {
				const publicationIdx = this.items.findIndex(p => p.id === data.id)
				if (publicationIdx > -1) this.items[publicationIdx].locked = data.lock
			},				
			publicationUpdate(publication) {
				const publicationIdx = this.items.findIndex(p => p.id === publication.id)
				if (publicationIdx > -1) {
					this.items[publicationIdx].owner = publication.owner
					this.items[publicationIdx].locked = false
				}
			},
			publicationDelete(id) {				
				const publicationIdx = this.items.findIndex(p => p.id === id)
				if (publicationIdx > -1) {
					this.items.splice(publicationIdx, 1)
				}
			},
			transferToken(collect) {
				const publicationIdx = this.items.findIndex(p => p.id === collect.publication)
				if (publicationIdx > -1) {
					const collectIdx = this.items[publicationIdx].collects.findIndex(c => c.id === collect.id)
					if (collectIdx > -1) {
						this.items[publicationIdx].collects[collectIdx] = collect
					} else {
						this.items[publicationIdx].collects = [ collect, ...this.items[publicationIdx].collects ]
					}
					this.items[publicationIdx].locked = false
				}				
			},
			queryValues(q) {
                return Object.fromEntries(
                    Object.entries(q).filter(([key, value]) => {
                        return value !== null && value !== undefined && value !== '' && this.query.hasOwnProperty(key)
                    })
                )
            },
            getQuery() {
                this.query = this.queryValues(this.$route.query)
                if (!this.query.page || this.query.id) this.query.page = 1
                if (!this.query.limit) this.query.limit = this.limitDefault
				if (!this.query.select) {
					if (this.mode === 'pub') this.query.select = 'all'
					if (this.mode === 'col') this.query.select = 'all'
					if (this.mode === 'exp') this.query.select = 'available'
				}        
				if (!this.query.sort) this.query.sort = 'desc'             
            },
            setQuery() {
                try { this.$router.push({ name: this.$route.name, query: this.queryValues(this.query) })
                } catch (error) { }
            },
            setPage(page) {
                this.query.id = null
                this.query.page = page
                this.get()
            },
			clearSearch() {
                this.query.search = null               
                this.setPage(1)
            }, 

			addPublication(publication) {
				if (this.mode === 'pub') {
					this.items = [ publication, ...this.items ]
				}				
			},

			async get() {
                await this.getList()
                this.setQuery()
            },

			async getList() {				
				this.gLoaderShow()
				try {					
					const publications = (await api.get('/publication/getList', {
                        params: {
                            ...this.queryValues(this.query),
							mode: this.mode
                        }
                    })).data
					
					this.items = publications.results
					this.totalPages = publications.totalPages
                    this.totalResults = publications.totalResults	
					window.scrollTo(0,0);				
				} catch (err) {
					console.log(err)
				}
				this.gLoaderHide()
			},
			
		},
	}
</script>
