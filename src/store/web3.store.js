import dayjs from 'dayjs';
import { ethers, utils } from "ethers";
import { defineStore } from "pinia";
//import { userStore } from "./user.store.js";
//import { parseAbi } from 'viem'
import bcConfig_all from '../../../bcConfig.json';
const bcConfig = bcConfig_all[CHAIN_ID]

//import { goerli } from 'viem/chains'
//import { createPublicClient, http } from 'viem'

export const web3Store = defineStore("web3", {	
	state: () => ({		
		web3Modal: null,	       
        client: null,
        account: null,
        accountChain: null,
        chainData: {
            id: CHAIN_ID,
            name: CHAIN_NAME,            
            explorerUrl: CHAIN_EXPLORER_URL,
            symbol: CHAIN_CURRENCY,            
        },
        timestamp: parseInt(dayjs().valueOf() / 1000), 
        bcConfig,
        fanaticoHubConfigData: null,
        fanaticoHub: { address: bcConfig.fanaticoHub.address, abi: JSON.parse((new utils.Interface(bcConfig.fanaticoHub.abi)).format(ethers.utils.FormatTypes.json))  }
    }),

	getters: {      
        chain: (state) => state.chainData,
        chainValid: (state) => state.accountData.chainId === state.chainData.id,    
        fanaticoHubConfig: (state) => state.fanaticoHubConfigData,
    },

    actions: {
        setWeb3Modal(web3Modal) {
            this.web3Modal = web3Modal
        },
        setClient(client) {
            this.client = client
            //console.log('ethereumClient ', client)
        },
        setChain(chain) {
            this.accountChain = chain
        },
        setAccount(account) {
            this.account = account
        },
        
        setFanaticoHubConfig(fanaticoHubConfig) {
            this.fanaticoHubConfigData = fanaticoHubConfig
        },

        async updateTimestamp() {
            try {
                this.timestamp = parseInt(dayjs().valueOf() / 1000)  // block.timestamp
            } catch (error) {
                console.log(error)
            }            
        },

        async connect() {
            //console.log(`connect`);                     
        },

        async disconnect() {             
            this.account = null
            this.accountChain = null
                        
            //localStorage.removeItem('lit-comms-keypair');
            //localStorage.removeItem('lit-auth-signature');
            //localStorage.removeItem('lit-web3-provider');
            //localStorage.removeItem('walletconnect');
            //localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
                        
            try {
                this.client.disconnect()
                //await this.web3Modal.clearCachedProvider();
            } catch (error) {
                console.log(error)
            }   
            
            localStorage.removeItem('wagmi.store');
            localStorage.removeItem('wagmi.connected');
            localStorage.removeItem('wagmi.injected.shimDisconnect');
            localStorage.removeItem('wagmi.wallet');
        },
    },
});
