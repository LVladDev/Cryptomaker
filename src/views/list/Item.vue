<template>
    <div class="card p-3 bg-white col-md-12 pub-card d-flex">
        <div class="row">
            <img class="pubCard-img p-0" :src="mediaUrl(item.picture)" alt="">
            <div class="desc-section">
                <router-link to="/my_pub" class="text-decoration-none title-text text-black" v-if="mode === 'pub'">
                    {{ item.title }}
                </router-link>
                <div class="title-text mb-1" v-else>
                    {{ item.title }}
                </div>
                <div class="mb-3">
                    <span class="me-2 fw-bold">Description:</span>
                    <br/>
                    {{ item.description }}
                </div>
                <div> 
                <span class="me-2 fs-3">Price:</span>
                <span class="fw-bold fs-3">    
                    {{ item.priceNum }} 
                    {{ $web3.chain.symbol }}
                </span>
            </div>
            </div>
            <div v-if="!insufficientBalance || collectedItem || mode === 'pub'" class="text-center align-items-center rounded-pill position-absolute p-2 m-2 bg bg-opacity-75 fw-bold text-primary col-md-2 col-xl-2 col-xxl-1 ribbon-encId"># {{ item.encryptedId }}-{{ item.decryptedId }}</div>
            <div v-if="!collectedItem && !item.collects?.length && insufficientBalance && mode !== 'pub'" class="text-center align-items-center bg-danger rounded-pill position-absolute p-2 m-2 bg bg-opacity-75 fw-bold text-primary col-md-4 col-xl-2 ribbon-insufBal">
                Insufficient balance
            </div>
        </div>
        <div class="pub-info" v-if="mode === 'exp'">
            <a href="#"
                class="text-decoration-none ms-2 fs-3 fw-bold"
                @click.prevent="$mitt.emit('search::by::user', item.user.address)"							
                >
                {{ $filters.addressShort(item.user.address) }}
            </a>
            <span class="fw-bold fs-5" style="color: #4D4E4E;">
                {{ $date(item.createdAt).format('DD MMM YYYY HH:mm') }}
            </span>
        </div>	
    
        <!-- <div class="_content _expanded" v-if="item.owner">
            <div class="d-flex justify-content-between align-items-center text-nowrap">
                <div class="text-secondary">Owner</div>
                <div class="border-bottom w-100 mx-2"></div>   
            </div>
            
            <div class="d-flex align-items-center justify-content-between py-1">	
                <div class="d-flex align-items-center">
                    <img :src="$user.profilePictureUrl(item.owner.picture)" class="_collect_user_avatar_picture me-2">										
                    <div class="d-flex  px-2">
                        <div>
                            {{item.owner.name || 'Anonym'}}
                        </div>
                        <a href="#"
                            class="text-decoration-none ms-2"
                            @click.prevent="$mitt.emit('search::by::user', item.owner.address)"						
                            >
                            {{ $filters.addressShort(item.owner.address) }}
                        </a>                    
                    </div>    
                </div>			
                
                <button class="btn btn-outline-primary px-3" @click="read()" v-if="!item.locked && collectedItem && isUnread">
                    Read
                </button>
                <button class="btn btn-outline-primary px-3" v-if="item.locked" disabled>
                    Confirming... 
                </button>
            </div>
                                                        
        </div> -->
            
        
        <div class="d-flex justify-content-between align-items-center mt-2" v-if="mode !== 'pub' && !collectedItem && !item.collects?.length"> 
            <div></div>
            <div class="d-flex">
                <template v-if="!item.locked && mode !== 'pub'">
                    <button class="btn btn-primary px-3 me-2 btn-custom-me" @click="collect()" v-if="!collectedItem && !item.collects?.length && !insufficientBalance">
                        Collect
                    </button>
                    <button class="btn btn-primary px-3 btn-custom-me" @click="collect(true)" v-if="!collectedItem && !item.collects?.length && !insufficientBalance">
                        Read
                    </button>     
                </template>
                <button class="btn btn-outline-primary px-3" v-if="item.locked" disabled>
                    Confirming... 
                </button>
            </div>            
        </div>
                
        <div class="_content _expanded" v-if="!item.locked && (mode === 'pub' || (collectedItem && !isUnread))">
            <div class="my-2 d-flex align-items-center text-nowrap">
                <div class="fw-bold">Private content</div>
                <a href="#"  v-if="!privateData" @click.prevent="decrypt()" class="ms-2 px-1 text-decoration-none text-black">
                    <svg width="18" height="18" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 17.1667V8.83334H4.99999V17.1667H15ZM15 7.16668C15.442 7.16668 15.8659 7.34227 16.1785 7.65483C16.4911 7.96739 16.6667 8.39132 16.6667 8.83334V17.1667C16.6667 17.6087 16.4911 18.0326 16.1785 18.3452C15.8659 18.6577 15.442 18.8333 15 18.8333H4.99999C4.55797 18.8333 4.13404 18.6577 3.82148 18.3452C3.50892 18.0326 3.33333 17.6087 3.33333 17.1667V8.83334C3.33333 8.39132 3.50892 7.96739 3.82148 7.65483C4.13404 7.34227 4.55797 7.16668 4.99999 7.16668H12.5V5.50001C12.5 4.83697 12.2366 4.20108 11.7678 3.73224C11.2989 3.2634 10.663 3.00001 9.99999 3.00001C9.33695 3.00001 8.70107 3.2634 8.23223 3.73224C7.76339 4.20108 7.49999 4.83697 7.49999 5.50001H5.83333C5.83333 4.39494 6.27231 3.33513 7.05372 2.55373C7.83512 1.77233 8.89493 1.33334 9.99999 1.33334C10.5472 1.33334 11.089 1.44112 11.5945 1.65051C12.1 1.85991 12.5594 2.16682 12.9463 2.55373C13.3332 2.94064 13.6401 3.39997 13.8495 3.9055C14.0589 4.41102 14.1667 4.95284 14.1667 5.50001V7.16668H15ZM9.99999 14.6667C9.55797 14.6667 9.13404 14.4911 8.82148 14.1785C8.50892 13.866 8.33333 13.442 8.33333 13C8.33333 12.558 8.50892 12.1341 8.82148 11.8215C9.13404 11.5089 9.55797 11.3333 9.99999 11.3333C10.442 11.3333 10.8659 11.5089 11.1785 11.8215C11.4911 12.1341 11.6667 12.558 11.6667 13C11.6667 13.442 11.4911 13.866 11.1785 14.1785C10.8659 14.4911 10.442 14.6667 9.99999 14.6667Z" fill="#4D4E4E"/>
                    </svg>
                    Decrypt
                </a>   
                <a href="#" v-if="privateData" @click.prevent="contentExpanded = !contentExpanded" class="ms-2 px-1 text-decoration-none text-black">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.66666 4.39171L2.73333 3.33337L16.6667 17.2667L15.6083 18.3334L13.0417 15.7667C12.0833 16.0834 11.0667 16.25 10 16.25C5.83333 16.25 2.27499 13.6584 0.833328 10C1.40833 8.53337 2.325 7.24171 3.49166 6.21671L1.66666 4.39171ZM10 7.50004C10.663 7.50004 11.2989 7.76343 11.7678 8.23227C12.2366 8.70111 12.5 9.337 12.5 10C12.5004 10.2838 12.4525 10.5657 12.3583 10.8334L9.16666 7.64171C9.43439 7.54753 9.71619 7.49962 10 7.50004ZM10 3.75004C14.1667 3.75004 17.725 6.34171 19.1667 10C18.4865 11.7277 17.3308 13.2273 15.8333 14.325L14.65 13.1334C15.8024 12.3362 16.7318 11.2576 17.35 10C16.6763 8.62499 15.6304 7.46652 14.3311 6.65629C13.0318 5.84607 11.5312 5.41661 10 5.41671C9.09166 5.41671 8.2 5.56671 7.36666 5.83337L6.08333 4.55837C7.28333 4.04171 8.60833 3.75004 10 3.75004ZM2.65 10C3.32369 11.3751 4.36964 12.5336 5.66894 13.3438C6.96824 14.154 8.46877 14.5835 10 14.5834C10.575 14.5834 11.1417 14.525 11.6667 14.4084L9.76666 12.5C9.1868 12.4379 8.64568 12.1791 8.23331 11.7667C7.82093 11.3544 7.56215 10.8132 7.5 10.2334L4.66666 7.39171C3.84166 8.10004 3.15 8.98337 2.65 10Z" fill="black" fill-opacity="0.6"/>
                    </svg>
                    {{ contentExpanded ? 'Hide' : 'Expand' }}  
                </a>
                <div style="width: 80%;">
                </div>
                <button class="btn btn-primary px-3 btn-custom-me" v-if="collectedItem">
                    <svg width="20" height="20" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.83331 17.5C5.37498 17.5 4.98248 17.3367 4.65581 17.01C4.32915 16.6833 4.16609 16.2911 4.16665 15.8333V5H3.33331V3.33333H7.49998V2.5H12.5V3.33333H16.6666V5H15.8333V15.8333C15.8333 16.2917 15.67 16.6842 15.3433 17.0108C15.0166 17.3375 14.6244 17.5006 14.1666 17.5H5.83331ZM7.49998 14.1667H9.16665V6.66667H7.49998V14.1667ZM10.8333 14.1667H12.5V6.66667H10.8333V14.1667Z" fill="white"/>
                    </svg>
                    Sell
                </button>
                <div class="d-flex align-items-center justify-content-between py-1" v-if="mode === 'pub'"> 
                    <button class="btn btn-primary px-3 btn-custom-me" @click="deleteIntent = true" v-if="!item.owner && !deleteIntent">
                        <svg width="20" height="20" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.83331 17.5C5.37498 17.5 4.98248 17.3367 4.65581 17.01C4.32915 16.6833 4.16609 16.2911 4.16665 15.8333V5H3.33331V3.33333H7.49998V2.5H12.5V3.33333H16.6666V5H15.8333V15.8333C15.8333 16.2917 15.67 16.6842 15.3433 17.0108C15.0166 17.3375 14.6244 17.5006 14.1666 17.5H5.83331ZM7.49998 14.1667H9.16665V6.66667H7.49998V14.1667ZM10.8333 14.1667H12.5V6.66667H10.8333V14.1667Z" fill="white"/>
                        </svg>
                        Delete
                    </button>

                    <div class="btn-group" role="group" v-if="!item.owner && deleteIntent">
                        <button type="button" class="btn btn-danger" @click="deletePublication()">Delete</button>
                        <button type="button" class="btn btn-secondary" @click="deleteIntent = false">Cancel</button>
                    </div>
                </div>
            </div>
            <div v-if="privateData && contentExpanded">
                <div v-html="compiledMarkdown"></div>
                <div class="mb-1" v-for="(media) in privateData.attachments">                        
                    <img class="w-100 border rounded overflow-hidden" v-if="media.type.includes('image')" :src="media.preview">                        
                    <div class="w-100 border rounded overflow-hidden" v-if="media.type.includes('video')">
                        <Plyr>
                            <video class="w-100" controls>
                                <source :src="media.preview" :type="media.type">
                            </video>
                        </Plyr>
                    </div>
                </div>    
            </div>										
        </div>
    </div>
</template>

<style lang="scss" scoped>
    ._collect_user_avatar_picture {
        width: 2rem;
		height: 2rem;	
        border-radius: 5rem;
    }
	._avatar_picture {
		border: 4px solid white;
		position: absolute;
        background-color: white;
		top: -4rem;
    	left: 1rem;
		width: 3.5rem;
		height: 3.5rem;		
		&._md {
			width: 4.5rem;
			height: 4.5rem;
		}
		&._lg {
			width: 6rem;
			height: 6rem;
		}
	}
    .pub-card {
        margin-bottom: 2.5%;
        border-radius: 20px;
        border: 0px;
        box-shadow: 0px 3px 5px 2px rgba(0, 0, 0, 0.25);
    }
    .desc-section {
        width: 80%
    }
    @media screen and (max-width: 1240px) {
        .pub-card {
            margin-bottom: 10%;   
        }
        .pubCard-img {
            max-height: 290px !important;
            width: 27% !important;
        }
        .pub-info {
            margin-left: 30% !important;
        }
        .desc-section {
            width: 68% !important;
        }
    }
    .ribbon-encId {
        background-color: #3DA4AC;
        color: white !important;
        border-radius: 5px !important;
        top: -25px !important;
        right: 10px !important;
    }
    .ribbon-insufBal {
        color: white !important;
        border-radius: 8px !important;
        top: -25px !important;
        right: 10px !important;
    }
    .pubCard-img {
        max-height: 200px;
        border-radius: 25px;
        width: 15%;
        margin: 0px 10px;
    }
    .title-text {
        font-weight: Bold;
        font-size: 32px;
    }
    .pub-info {
        margin-left: 16%;
        a {
            color: #3DA4AC;
        }
        span {
            float: right;
            margin-right: 15px;
            padding-top: 7px;
        }
    }
    .btn-custom-me {
        background-color: #3DA4AC;
        border: none;
    }
</style>

<script>
	import { api } from '@/api/api'
    import { marked } from 'marked';
    import tlds from 'tlds';
    import { publicationStore } from '@/store/publication.store'
    import Plyr from '@/views/components/Plyr.vue'    
  
    import { prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core'
    import { BigNumber } from 'ethers';

	
	export default {	
        components: {
            Plyr
        },
		props: {
			item: { type: Object, required: true },
            mode: { type: String, required: true },
		},	
		data() {
			return {
				privateData: null,	
                contentExpanded: false,		
                deleteIntent: false,						
			}
		},
		computed: {
            collected() {
                return this.item.collects.filter(c => parseInt(c.tokenId) % 2 != 0)
            },
            readed() {
                return this.item.collects.filter(c => parseInt(c.tokenId) % 2 == 0)
            },
            collectedItem() {
                if (this.mode === 'pub' || !this.$user.profile?.id) return null
                return this.item.collects.find(c => c.user.id === this.$user.profile.id)
            },
            isUnread() {
                if (!this.collectedItem) return null 
                return parseInt(this.collectedItem.tokenId) % 2 != 0
            },
            insufficientBalance() {
                if (!this.$user.wallet.ethBalance) return true
                if (this.$user.wallet.ethBalance < BigInt(this.item.price)) return true
                return false
            },
			mediaUrl(){ return function (url) {                
				if (url.includes('ipfs')) {
					return url.replace('ipfs://', 'https://fanatico.infura-ipfs.io/ipfs/')
				}
                return url
            }},	
            compiledMarkdown() {
                return marked(this.privateData.content);
            },		
		},		
		
		methods: {	
            
            
			async collect(read = false) {
                await this.gCallMethod({
					title: 'Collect', loader: true, emit: 'profile::update',
					method: async function () {												
						const { collectData, signatureServer } = (await api.post(`/publication/collect`, { id: this.item.id, read })).data
                        
                        const { request } = await prepareWriteContract({
                            ...this.$web3.fanaticoHub,
                            functionName: 'collect',
                            args: [Object.values(collectData), signatureServer],
                            value: collectData.price,
                            account: this.$web3.account.address
                        })
						
                        const { hash } = await writeContract(request)

                        this.$mitt.emit("item::lock", { id: this.item.id, lock: true })		

						return hash
					}.bind(this),
					callback: async function () {
						//this.$mitt.emit("item::lock", { id: this.item.id, lock: false })
                    }.bind(this),
				})              
			},

            async deletePublication() {				
				this.gLoaderShow()
				try {					
					await api.post(`/publication/delete`, { id: this.item.id })
					
					this.$mitt.emit("item::delete", { id: this.item.id })		
                    
                    this.$swal({ icon: "success", title: 'Deleted' });
				} catch (error) {
					console.log(error)
                    this.$swal({ icon: "error", title: 'Delete', text: error.toString() });
				}
				this.gLoaderHide()
			},

            async read() {				
				await this.gCallMethod({
					title: 'Read', loader: true, emit: 'profile::update',
					method: async function () {												
						const { request } = await prepareWriteContract({
                            ...this.$web3.fanaticoHub,
                            functionName: 'read',
                            args: [this.item.encryptedId],
                            account: this.$web3.account.address
                        })
                        const { hash } = await writeContract(request)
						
                        this.$mitt.emit("item::lock", { id: this.item.id, lock: true })		

						return hash
					}.bind(this),
					callback: async function () {
						//this.$mitt.emit("item::lock", { id: this.item.id, lock: false })
                        this.decrypt()
					}.bind(this),
				})
			},

            async decrypt() {
                this.gLoaderShow()
                try {
                    this.privateData = await publicationStore().decrypt(this.item.contentUri)    
                    this.contentExpanded = true                                  
                } catch (error) {                    
                    console.log(error)
                    this.$swal({ icon: "error", title: 'Decryption', text: error.toString() });
                }                
                this.gLoaderHide()
            }
		},
	}

    const mention = {
        name: 'mention',
        level: 'inline',
        start(src) {
            const regexp = /(@[a-z\d_.]{1,31})/g;
            const matches = src.match(regexp);
            if (matches) {                
                const index = src.indexOf(matches[0])
                return index
            }             
        }, 
        tokenizer(src) {
            const rule = /^(@[a-z\d_.]{1,31})/g;
            const match = rule.exec(src);            
            if (match) {
                return {
                    type: 'mention',
                    raw: match[0],
                    user: match[0].trim().replace('@', ''),  
                };                
            }            
        },
        renderer(token) {
            return `<a href="#${token.user}" target="_blank" class="text-decoration-none">${token.raw}</a>`
        }
    }
    const hashtag = {
        name: 'hashtag',
        level: 'inline', 
        start(src) {
            const regexp = /(#\w*[A-Za-z]\w*)/g;
            const matches = src.match(regexp);
            if (matches) {                
                const index = src.indexOf(matches[0])
                return index
            }             
        }, 
        tokenizer(src) {
            const rule = /^(#\w*[A-Za-z]\w*)/g;
            const match = rule.exec(src);            
            if (match) {
                return {
                    type: 'hashtag',
                    raw: match[0],
                    q: match[0].trim().replace('#', ''),  
                };                
            }            
        },
        renderer(token) {
            return `<a href="#${token.q}" target="_blank" class="text-decoration-none">${token.raw}</a>`;
            return `<a href="/search?q=${token.q}&amp;type=pubs&amp;src=link_click" target="_blank" class="text-decoration-none">${token.raw}</a>`;
        }
    }

    const protocol = `(?:(?:[a-z]+:)?//)?`;
    const auth = '(?:\\S+(?::\\S*)?@)?';
    const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
    const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
    const tld = `(?:\\.(?:${tlds.sort((a, b) => b.length - a.length).join('|')}))+`;
    const port = '(?::\\d{2,5})?';
    const path = '(?:[/?#][^\\s"]*)?';
    const regex = `(?:${protocol}|www\\.)${auth}(?:${host}${domain}${tld})${port}${path}`;

    const anylink = {
        name: 'anylink',
        level: 'inline',
        start(src) {
            const regexp = new RegExp(`(${regex})(?=[^#@\\w]|$)`, 'ig');
            const matches = src.match(regexp);
            if (matches) {                
                const index = src.indexOf(matches[0])
                return index
            }             
        }, 
        tokenizer(src) {
            const rule = new RegExp(`^(${regex})(?=[^#@\\w]|$)`, 'ig')
            const match = rule.exec(src);            
            if (match) {
                const hasHref = ['http://', 'https://'].some(s => match[0].includes(s))   
                const link = hasHref ? match[0] : 'https://' + match[0]         
                return {                                        
                    type: 'anylink',
                    raw: match[0],
                    link,
                };                
            }            
        },
        renderer(token) {
            return `<a href="${token.link}" target="_blank" class="text-decoration-none">${token.raw}</a>`
        }
    }
    
    marked.use({ extensions: [mention, hashtag, anylink] })
</script>