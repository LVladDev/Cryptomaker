import { utils } from 'ethers';


export default {
	computed: {
		gIsDevMode() {
			return process.env.NODE_ENV !== 'production';
		},
		gIsTxAllowed() {
			return this.$user.profile && this.$web3.account.address && this.$filters.compareAddress(this.$user.profile.ownedBy, this.$web3.account.address) && this.$web3.chainValid;
		},
	},

	methods: {				
		async gSwitchChain() {
			try {
				const chainId = this.$web3.chain.id;
				//console.log('gSwitchToNetwork', parseInt(chainId), utils.hexValue(utils.hexlify(parseInt(chainId))));
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: utils.hexValue(utils.hexlify(parseInt(chainId))) }],
				});
			} catch (error) {
				console.log(error);				
				this.$swal({
					icon: 'error',
					title: 'Chain change error',
					text: this.gParseErrorMessage(error),
					timer: 3000,
				});
			}
		},
		
		
		//async gAddToMetamask(address, symbol, decimals, img) {
		//	try {
		//		await window.ethereum.request({
		//			method: 'wallet_watchAsset',
		//			params: {
		//				type: 'ERC20',
		//				options: {
		//					address,
		//					symbol,
		//					decimals,
		//					image: window.location.origin + img,
		//				},
		//			},
		//		});
		//	} catch (error) {
		//		console.log(error);
		//		this.$swal({
		//			icon: 'error',
		//			title: 'Add asses error',
		//			text: this.gParseErrorMessage(error),
		//			timer: 3000,
		//		});
		//	}
		//},

		//async gSwitchAccount(address){
		//	try {				
		//		await window.ethereum.request({
		//			method: 'wallet_requestPermissions',
		//			params: [{ eth_accounts: {address: [address]} }],
		//		});				
		//	} catch (error) {
		//		console.log(error);
		//		this.$swal({
		//			icon: 'error',
		//			title: 'Switch account error',
		//			text: this.gParseErrorMessage(error),
		//			timer: 3000,
		//		});
		//	}
		//},
		
		gParseErrorMessage(error) { 
            // web3 lenshub 0x0819bdcd 
            try {
                let str1 = error.message
                const toSearch1 = `reverted with an unrecognized custom error (return data: `;                    
                const index1 = str1.indexOf(toSearch1);                    
                if (index1 != -1) {                        
                    const data = str1.slice(index1 + toSearch1.length, index1 + toSearch1.length + 10)                            
                    //console.log('gParseErrorMessage web3 data', data) 
					const errorData = this.$web3.lensHub.instance.interface.parseError(data)        
					return 'Lens HUB: ' + errorData.name                                           
                }                    	
            } catch (error) {
                console.log('gParseErrorMessage web3 lenshub', error)
            }

            // web3 reason string
            try { 
                let str1 = error.message                  
                const toSearch1 = `reverted with reason string '`;
                const toSearch2 = `'`;
                const index1 = str1.indexOf(toSearch1);
                if (index1 != -1) {
                    str1 = str1.slice(index1 + toSearch1.length);
                    const index2 = str1.indexOf(toSearch2);
                    if (index2 != -1) {
                        return str1.slice(0, index2);
                    }
                }                    	
            } catch (error) {
                console.log('gParseErrorMessage web3 reason string', error)
            }
            
            // web3 ethjs-query
            try { 
                let str1 = error.message                    
                const toMatch = '[ethjs-query] while formatting outputs from RPC'
                const toSearch1 = `"message":"`;
                const toSearch2 = `"`;

                const indexMatch = str1.indexOf(toMatch);
                const index1 = str1.indexOf(toSearch1);                    
                if (indexMatch != -1 && index1 != -1) {
                    str1 = str1.slice(index1 + toSearch1.length);
                    const index2 = str1.indexOf(toSearch2);
                    if (index2 != -1) {
                        return 'RPC: ' + str1.slice(0, index2);
                    }
                }                    	
            } catch (error) {
                console.log('gParseErrorMessage web3 ethjs query', error)
            }
			
            // match
			let errStr
			try {                              
                if (error.response?.data?.message) { 
					errStr = error.response.data.message.toString()                        
                } else if (error?.message) {                        
                    errStr = error.message.toString()
				} else {
                    errStr = error.toString()
                } 
				
				const match =  errStr.match(/reason="(.*?)"/i);
                if (match) {
                    errStr = match[1]
                } else if (errStr.includes('code=')) {          
                    errStr = errStr.replace(/ *\([^)]*\) */g, "")
                }
            } catch (error) {   
				console.log('gParseErrorMessage match', error)                
            }
						
			return errStr.length <= 300 ? errStr.capitalize() : errStr.slice(0, 150).capitalize() + '...';
        },
		
		// Loader
		gLoaderShow(options = {}) {
			try {
				if (this.$loader) {
					this.$loader.hide();
					this.$loader = null;
				}
				this.isLoading = true;
				options.container = options.container ? options.container : document.querySelector('[loading-container]');
				this.$loader = this.$loading.show(options);
			} catch (error) {}
		},

		gLoaderHide(delay = 500) {
			return new Promise((resolve) =>
				setTimeout(() => {
					try {
						if (this.$loader) this.$loader.hide();
						this.$loader = null;
						this.isLoading = false;
					} catch (error) {}
					resolve();
				}, delay)
			);
		},

		async gCallMethod({ method, title, loader, emit, callback }) {
			if (loader) {
				this.gLoaderShow();
			}
			try {
				const hash = await method();
				if (loader) {
					this.gLoaderHide();
					await this.gWait(500);
				}

				this.$mitt.emit('tx::swall', { hash, msg: { title }, emit, callback });
				this.$swal({
					icon: 'success',
					title,
					text: 'Please wait for blockchain confirmation!',
					footer: `<a href="${this.$web3.chain.explorerUrl + 'tx/' + hash}" target="_blank">${this.$filters.txHashShort(hash)}</a>`,
					timer: 5000,
					showConfirmButton: true,
				});
			} catch (error) {
				if (loader) {
					this.gLoaderHide();
					await this.gWait(500);
				}
				//console.log(error);
				
				this.$swal({
					icon: 'error',
					title,
					text: this.gParseErrorMessage(error),
					timer: 30000,
				});
			}
		},

		gWait(delay = 500) {
			return new Promise((resolve) =>
				setTimeout(() => {
					resolve();
				}, delay)
			);
		},

		gOpenLink(url) {
			//console.log(url);
			const { hostname } = new URL(url);
			//console.log(hostname, window.location.host);
			if (hostname === window.location.host) return;

			window.open(url, '_blank');
		},

		
		async gCopyToClipboard(text) {
			if (!text) return;
			if (await copyTextToClipboard(text)) {			  
				this.$swal({
					icon: 'success',
					text: 'Copied to clipboard',
					timer: 1500,
				});  
			} else {
			  this.$swal({
				icon: 'error',
				text: 'Error copying to clipboard. Please do it manually',
				timer: 3000,
			});
			}
		},
	},
};

async function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
	  var textArea = document.createElement("textarea");
	  textArea.value = text;
	  // Avoid scrolling to bottom
	  textArea.style.top = "0";
	  textArea.style.left = "0";
	  textArea.style.position = "fixed";
	  document.body.appendChild(textArea);
	  textArea.focus();
	  textArea.select();
	  try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	  } catch (err) {
		console.log('Fallback: Oops, unable to copy', err);
		return false;
	  }
	  document.body.removeChild(textArea);
	  return true;
	}
	try {
		await navigator.clipboard.writeText(text)
		console.log('Async: Copying to clipboard was successful!');
		return true;
	} catch (error) {
		console.log('Async: Could not copy text: ', err);
		return false;
	}
  }

//function cleanObject(obj) {
//  return JSON.parse(JSON.stringify(obj))
//}

//export {
//  cleanObject
//}
