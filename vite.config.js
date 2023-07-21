import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

//const production = process.env.NODE_ENV === 'production' 
const production = true
//const chainId = 1
const chainId = '0x5' 
const mainChain = chainId === '0x1'

console.log('.')

// ..\node_modules\@lit-protocol\encryption\src\lib\encryption.js
// ..\node_modules\@lit-protocol\auth-browser\src\lib\chains\eth.js
// ..\node_modules\@lit-protocol\auth-browser\src\lib\auth-browser.js

// https://vitejs.dev/config/
export default defineConfig(() => {	
	return {
		plugins: [
			vue({
				template: {
				  compilerOptions: {
					isCustomElement: (tag) => ['-core-button'].includes(tag),
				  }
				}
			}),
		],
		server: {
			port: 5200
		},
		//css: {
		//	preprocessorOptions: {
		//	  scss: {
		//		additionalData: `@import '@/scss/app.scss';`
		//	  }
		//	}
		//},
		css: {
			loaderOptions: {
			  sass: {
				implementation: require("sass"),
				//additionalData: `@import "~@/scss/_variables.scss";`,
			  },
			},
			preprocessorOptions: {
				scss: {
				  includePaths: ['node_modules']
				}
			  }
		  },
		define: {
			IS_PRODUCTION: production,
			APP_NAME: JSON.stringify('FANATICO'),		
			CHAIN_CURRENCY: JSON.stringify('ETH'),
			CHAIN_NAME: JSON.stringify(mainChain ? 'Ethereum' : 'Goerli'),
			
			IS_MAIN_CHAIN: mainChain,
			CHAIN_ID: JSON.stringify(chainId),
			CHAIN_RPC_URL: JSON.stringify(mainChain ? 'https://mainnet.infura.io/v3/c101d7466e634aaa93a3415b994fc00b' : 'https://goerli.infura.io/v3/c101d7466e634aaa93a3415b994fc00b'),
			CHAIN_EXPLORER_URL: JSON.stringify(mainChain ? 'https://etherscan.io/' : 'https://goerli.etherscan.io/'),
			
			API_URL: JSON.stringify(production ? (mainChain ? '' : 'https://fanatico-api.appdev.pp.ua') : 'http://127.0.0.1:3900'),

			WALLET_CONNECT_PR_ID: JSON.stringify('cc91ae836e04fb8c547b282b015e0e25'),
			INFURA_PR_ID: JSON.stringify('2NSM3Nt9x4c7xUho5oRM629TDnt'),
			INFURA_SERCET: JSON.stringify('e0693705597ab31bdd167c3a66309c3f'),						
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),	
				crypto: "crypto-browserify",			
			},
		},
		optimizeDeps: {
			esbuildOptions: {
				// Node.js global to browser globalThis
				define: {
					global: 'globalThis',
				},
				// Enable esbuild polyfill plugins
				plugins: [
					NodeGlobalsPolyfillPlugin({
						//buffer: true,
						process: true,						
					}),
					//NodeModulesPolyfillPlugin(),
				],
			},
		},		
		build: {
			rollupOptions: {
				plugins: [
					rollupNodePolyFill()
				],
			},
			chunkSizeWarningLimit: false,
			
			//outDir: path.resolve("z:/www/client"),		
			//emptyOutDir: true,
			//root: 'src',
		},		
	};
});
