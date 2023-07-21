<template>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <div class="row">
        <!-- The image half -->
        <div class="col-md-6 d-none d-md-flex bg-image align-items-end justify-content-center">
            <div class="text-center my-3">	
                <div class="d-flex justify-content-center align-items-center mb-2">
                    <!-- <div class="_icon_notion bg-light me-2 "></div> -->
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                        <path d="M16 21.475V18.475H13V16.475H16V13.475H18V16.475H21V18.475H18V21.475H16ZM4 18.5V16.5H11.075C11.025 16.85 11.004 17.1833 11.012 17.5C11.02 17.8167 11.0493 18.15 11.1 18.5H4ZM4 14.5V12.5H13.65C13.2667 12.7667 12.9207 13.0667 12.612 13.4C12.3033 13.7333 12.0327 14.1 11.8 14.5H4ZM4 10.5V8.5H19V10.5H4ZM4 6.5V4.5H19V6.5H4Z" fill="white"/>
                    </svg>
                    <a href="https://notion.site" class="text-decoration-none me-3" target="_blank" rel="noopener noreferrer" :style="{color: 'white'}">Documentation</a>
                    <div class="_icon_discord bg-light me-2 "></div>
                    <a href="https://discord.gg" class="text-decoration-none" target="_blank" rel="noopener noreferrer" :style="{color: 'white'}">Discord</a>
                </div>
            </div>
        </div>
        <!-- The content half -->
        <div class="col-md-6">
            <div class="login d-flex align-items-center">
                <!-- Demo content-->
                <div class="container">
                    <div class="row">
                        <div class="col-lg-10 col-xl-7 mx-auto text-center">
                            <h3 class="login-title mb-5">Login</h3>

                            <button type="button" @click="$emit('open-modal')" class="wallet-button btn btn-info" v-if="$web3.account?.address">
                                {{walletAddress?.slice(0,7) + "..." + walletAddress?.slice(-4)}}
                            </button>
                            <button type="button" @click="$emit('open-modal')" class="wallet-button btn btn-info" v-else>Connect Wallet</button>

                            <div v-if="$web3.account?.address">
                                <div class="h4 mt-3">
                                    In order to use <br>service  please login
                                </div>
                                <button type="button" class="btn btn-info login-button mt-3" @click="loginLens()">
                                    <svg width="34" height="31" viewBox="0 0 34 31" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
                                        <path d="M15.3333 7.16667L12.9999 9.5L17.3333 13.8333H0.333252V17.1667H17.3333L12.9999 21.5L15.3333 23.8333L23.6666 15.5L15.3333 7.16667ZM30.3333 27.1667H16.9999V30.5H30.3333C32.1666 30.5 33.6666 29 33.6666 27.1667V3.83333C33.6666 2 32.1666 0.5 30.3333 0.5H16.9999V3.83333H30.3333V27.1667Z" fill="white"/>
                                    </svg>
                                    &nbsp;&nbsp;Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div><!-- End -->
            </div>
            <div class="text-center pb-4" :style="{ fontWeight: 'bold' }">© Fanatico {{new Date().getFullYear()}}</div>
        </div><!-- End -->
    </div>
</template>

<style>
    .login,
    .image {
        min-height: calc(100vh - 48px);
    }
    .bg-image {
        background-image: url('../../assets/img/F_Cover2.png');
        background-size: cover;
        background-position: center;
    }
    .login-title {
        font-style: normal;
        font-weight: 700;
        font-size: 56px;
        line-height: 76px;
        color: #000000;
    }
    .login-button {
        width: 340px;
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 49px;
        background-color: #3DA4AC;
    }

    .wallet-button {
        width: 340px;
        font-style: normal;
        font-weight: 400;
        font-size: 36px;
        line-height: 49px;
        background-color: white;
        color: #3DA4AC;
        border: solid 2px #3DA4AC;
    }
</style>

<script>
    import { fetchFeeData, getAccount } from '@wagmi/core';

    export default {
        props: {
            openModal: {
                type: Function,
                required: true
            },
            walletAddress: {
                type: String,
                required: true
            }
        },
        mounted() {
            const self = this
            setTimeout(async function tick() {				
				if(getAccount() && !self.$web3.account )
                self.$web3.disconnect()
			}, 1000)
        },
        data() {
            return {
                backgroundImageUrl: '../../../src/assets/img/F_Cover2.png'
            }  
        },
        methods: {
            async loginLens() {
                this.gLoaderShow()
                try {
                    await this.$user.login()		
                } catch (error) {
                    console.log(error)
                    this.$swal({
                        icon: 'error',
                        title: 'Login error',
                        text: this.gParseErrorMessage(error),
                        timer: 3000,          
                    });
                }
                this.gLoaderHide()
            }
        }
    }
</script>