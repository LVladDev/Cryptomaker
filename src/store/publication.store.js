import { defineStore } from 'pinia';
import { uploadFileToIPFS } from '@/api/ipfs';
import { web3Store } from '@/store/web3.store'
import { userStore } from '@/store/user.store'
import { utils } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import JSZip from "jszip";
import { api } from '@/api/api'
import { getWalletClient } from '@wagmi/core'

//import { SiweMessage } from 'siwe'

const publicationDefault = {
    title: null,
    description: null,
    picture: null,
    price: 0.01,
    content: '',    
    attachments: []    
}

var litNodeClient

export const publicationStore = defineStore('publication', {
	state: () => ({
        attachmentsMaxCount: { image: 4, video: 1, audio: 1 },
        attachmentsMaxSize: { image: 10000000, video: 100000000, audio: 100000000 },
        publication: JSON.parse(JSON.stringify(publicationDefault)),   
        ALLOWED_IMAGE_TYPES: [ 'image/jpeg', 'image/png', 'image/webp', 'image/gif' ],
		ALLOWED_VIDEO_TYPES: [ 'video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime' ],
		ALLOWED_AUDIO_TYPES: [ 'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/webm', 'audio/flac' ], 
	}),

    getters: {
        ALLOWED_MEDIA_TYPES: (state) => [ ...state.ALLOWED_VIDEO_TYPES, ...state.ALLOWED_IMAGE_TYPES ], // , ...state.ALLOWED_AUDIO_TYPES
        isImagePublication(state) { return state.ALLOWED_IMAGE_TYPES.includes(state.publication.attachments[0]?.type) },
        isVideoPublication(state) { return state.ALLOWED_VIDEO_TYPES.includes(state.publication.attachments[0]?.type) },
        isAudioPublication(state) { return state.ALLOWED_AUDIO_TYPES.includes(state.publication.attachments[0]?.type) },
        imagesCount(state) { return state.publication.attachments.reduce((acc, attachment) => acc + (attachment.type.includes('image') ? 1 : 0), 0) },
        videosCount(state) { return state.publication.attachments.reduce((acc, attachment) => acc + (attachment.type.includes('video') ? 1 : 0), 0) },
        audiosCount(state) { return state.publication.attachments.reduce((acc, attachment) => acc + (attachment.type.includes('audio') ? 1 : 0), 0) },
        imageUploadDisabled(state) { return this.imagesCount >= state.attachmentsMaxCount.image || this.videosCount || this.audiosCount },
        videoUploadDisabled(state) { return this.videosCount >= state.attachmentsMaxCount.video || this.imagesCount || this.audiosCount },
        audioUploadDisabled(state) { return this.audiosCount >= state.attachmentsMaxCount.audio || this.imagesCount || this.videosCount},
        isPriceInValid(state) { 
            if (!state.publication.price) return 'Price required'
            if (state.publication.price < 0.0001) return 'Price too low. Min 0.0001'
            if (state.publication.price > 1000000) return 'Price too big. Max 1000000'
            return false
        },
        isTitleInValid(state) {
            if (!state.publication.title) return 'Title required'
            if (state.publication.title.trim().length < 3) return 'Title too short. Min 3 charackters'
            if (state.publication.title.trim().length > 150) return 'Title too long. Max 150 charackters'
            return false
        },
        isDescriptionInValid(state) {
            if (!state.publication.description) return 'Description required'
            if (state.publication.description.trim().length < 3) return 'Description too short. Min 3 charackters'
            if (state.publication.description.trim().length > 300) return 'Description too long. Max 300 charackters'
            return false
        },
        isContentInValid(state) {
            if (!state.publication.content) return 'Content required'
            if (state.publication.content.trim().length < 3) return 'Content too short. Min 3 charackters'
            if (state.publication.content.trim().length > 100000) return 'Content too long. Max 100k charackters'
            return false
        },
        
        isPublicationValid(state) { 
            return !this.isTitleInValid && !this.isPriceInValid  && !this.isDescriptionInValid  && !this.isContentInValid && state.publication.picture
        },
        mediaUrl: () => {
			return function (url) {				
				if (url.includes('ipfs')) {
					return url.replace('ipfs://', 'https://fanatico.infura-ipfs.io/ipfs/')
				}
				return url	
			}
		},        
    },

    actions: {
		setPublication(publication) { 
            this.publication = publication 
        },
        setAudioPublication(audioPublication){
            this.audioPublication = audioPublication
        },         	
        resetPublication() {
            this.publication = JSON.parse(JSON.stringify(publicationDefault))
            this.publication.title = `Public title by @${userStore().profile.name}`
            this.publication.description = `Public description of publication`
            this.publication.content = `Private description of publication`
        },        
        async getTextNftUrl(title, description, username, timestamp) {
            const svg = `
                <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <style>
                        .title {
                            font: bold 15px sans-serif;
                            color: black;
                        }
                        .description {
                            font: normal 14px sans-serif;
                            color: black;
                        }
                        .timestamp {
                            font: normal 13px sans-serif;
                            color: black;
                            opacity: 70%;
                        }
                        .username {
                            font: bold 15px sans-serif;
                            color: black;
                        }
                    </style>
                    <g clip-path="url(#clip0_1_2)">
                        <foreignObject x="30" y="30" width="440" height="300">
                            <p class="title" xmlns="http://www.w3.org/1999/xhtml">${title}</p>
                        </foreignObject>
                        <foreignObject x="30" y="50" width="440" height="300">
                            <p class="description" xmlns="http://www.w3.org/1999/xhtml">${description}</p>
                        </foreignObject>
                        <foreignObject x="350" y="440" width="440" height="300">
                            <p class="timestamp" xmlns="http://www.w3.org/1999/xhtml">${timestamp}</p>
                        </foreignObject>
                        <foreignObject x="30" y="15" width="440" height="300">
                            <p class="username" xmlns="http://www.w3.org/1999/xhtml">@${username}</p>
                        </foreignObject>
                    </g>
                    <defs>
                        <clipPath id="clip0_1_2">
                            <rect width="500" height="500" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            `;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const file = new File([blob], 'post.svg', { lastModified: new Date().getTime(), type: blob.type });
            const result = await uploadFileToIPFS(file);
            return result?.item ?? null;
        },                   
        getTags(inputText) {
            const regex = /(?:^|\s)#([\dA-Za-z]+)/gm;
            const matches = inputText.match(regex)?.map((tag) => tag.trim().slice(1)) ?? [];
            const uniqueTags = [...new Set(matches)];
            return uniqueTags.slice(0, 5);
        }, 
        getMainContentFocus(attachments) {
            if (attachments.length > 0) {
                if (this.isAudioPublication) {
                    return this.publicationMainFocus.Audio;
                } else if (this.ALLOWED_IMAGE_TYPES.includes(attachments[0]?.type)) {
                    return this.publicationMainFocus.Image;
                } else if (this.ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
                    return this.publicationMainFocus.Video;
                } else {
                    return this.publicationMainFocus.TextOnly;
                }
            } else {
                return this.publicationMainFocus.TextOnly;
            }
        },
        getPublicatinMetadata() {
            return {
                content: this.publication.content,
                media: this.publication.attachments.filter(attachment => attachment.status === 'OK' && !attachment.ipfsError).map((attachment) => ({
                    original: {
                        mimeType: attachment.type,
                        preview: attachment.preview,
                    }                    
                })),                
            }
        },

        async decrypt(ipfsCid) {
            if (!litNodeClient) {
                litNodeClient = new LitJsSdk.LitNodeClient();
                await litNodeClient.connect()
            }
            const chain = web3Store().chain.name.toLowerCase()

            const walletClient = await getWalletClient()

            
            //const sig = JSON.parse(localStorage.getItem('lit-auth-signature'))      
            //if (sig) {
            //    const parsedSiwe = new SiweMessage(sig.signedMessage);
            //    console.log('decrypt', parsedSiwe)
            //}       
            


            const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain, provider: walletClient });   
                               
            const decrypted = await LitJsSdk.decryptFromIpfs({ 
                authSig, 
                litNodeClient,
                ipfsCid: `https://fanatico.infura-ipfs.io/ipfs/${ipfsCid}`,                  
            })
            
            const zip = await JSZip.loadAsync(decrypted)

            const data = {
                content: null, 
                attachments: []
            }
            for (const key in zip.files) {
                if (Object.hasOwnProperty.call(zip.files, key)) {                                      
                    const item = zip.files[key];
                    const name = key.split('.')
                    if (name[0] === 'content') {
                        data.content = await item.async("string")
                    }
                    if (parseInt(name[0]) >= 0) {
                        
                        data.attachments.push({
                            id: uuidv4(),
                            type: `${name[1]}/${name[2]}`,
                            preview: URL.createObjectURL(await item.async("blob")),
                        })
                    }                    
                }
            }
            return data
        },
               
        async preparePublicationData() {               
            let content = this.publication.content   
            const chain = web3Store().chain.name.toLowerCase()
            
           
            try {                
                this.publication.picture.ipfs = `ipfs://${(await uploadFileToIPFS(this.publication.picture.file))}`                    
            } catch (error){
                console.log(error)   
                this.publication.picture.ipfsError = true                       
                throw Error('Something went wrong while cover uploading, try again or change cover image')
            }

            
            const publicationNew = {
                title: this.publication.title,
                description: this.publication.description,
                picture: this.publication.picture.ipfs,
                tags: this.getTags(content),
                price: utils.parseEther(this.publication.price.toString()).toString(),
                priceNum: this.publication.price,
                attachments: this.publication.attachments.map((attachment) => ({
                    type: attachment.type,
                }))             
            }

            const publication = (await api.post('/publication/createPublication', { publication: publicationNew })).data.publication
            
            const zip = new JSZip();
            zip.file("content.txt", content);
            this.publication.attachments.map((attachment, i) => {
                const ext = attachment.type.split('/')
                zip.file(`${i}.${ext[0]}.${ext[1]}`, attachment.file)
            })

            const accessControlConditions = [
                {
                    contractAddress: '',
                    standardContractType: '',
                    chain,
                    method: '',
                    parameters: [
                        ':userAddress',
                    ],
                    returnValueTest: {
                        comparator: '=',
                        value: utils.getAddress(web3Store().account.address) 
                    }                    
                },
                { operator: "or" },
                {
                    contractAddress: web3Store().fanaticoHub.address,
                    standardContractType: 'ERC1155',
                    chain,
                    method: 'balanceOf',
                    parameters: [
                        ':userAddress',
                        publication.decryptedId.toString()
                    ],
                    returnValueTest: {
                      comparator: '>',
                      value: '0'
                    }
                }
            ];
           
            if (!litNodeClient) {
                litNodeClient = new LitJsSdk.LitNodeClient();
                await litNodeClient.connect()
            }
            
            const walletClient = await getWalletClient()
            const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain, provider: walletClient });   
            
            const fileZip = await zip.generateAsync({ type: "blob" })

            const contentUri = await LitJsSdk.encryptToIpfs({
                authSig,
                accessControlConditions,
                chain,
                file: fileZip, 
                litNodeClient,
                infuraId: INFURA_PR_ID,
                infuraSecretKey: INFURA_SERCET,
            });   

            return (await api.post('/publication/confirmPublication', { id: publication.id, contentUri })).data.publication            
        },          
	},
});
