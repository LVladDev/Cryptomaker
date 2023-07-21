<template>
	<div>
		<!-- <button class="navbar-toggler sidebar" type="button" @click="toggleSidebar" :class="{ visible: !sidebarVisible }">
			<img src="@/assets/img/Group_33.png" class="pt-3" :style="{ maxWidth: '75%', margin: '24px 0px 0px 0px' }"/>
		</button> -->
		<div class="_profile bg-img p-4 sidebar" v-if="$user.profile && $user.auth && $web3.account" :class="{ visible: sidebarVisible }">
			<div class="row mb-3">
				<div class="col-9 col-md-9 col-lg-9 col-xl-9">
					<img src="@/assets/img/F_App_Icon.png" class="logo-image"/>
				</div>
				<div class="col-3 col-md-3 col-lg-3 col-xl-3">
					<a role="button" class="navbar-toggler" @click="toggleSidebar">
						<img src="@/assets/img/Group_32.png" class="pt-3" :style="{ maxWidth: '100%' }"/>
					</a>
				</div>
			</div>
			<div class="row profile m-0 mt-3">
					<div class="d-flex align-items-between my-1 py-1">
						<div v-if="$user.profile" class="position-relative">
							<a href="#" role="button"
								@click="$refs.profilePictureInput.click()"
								>
							<div class="_avatar_picture align-self-center me-2"
								:class="{ '_md': $breakpoint.gte('md'), '_lg': $breakpoint.gte('lg') }">
								<!-- <img src="@/assets/img/avatar.jpg" class="avatar-img" /> -->
								<img :src="$user.profilePictureUrl($user.profile?.picture)" alt=";)" class="">										
							</div>
							</a>
							<input
								class="_hidden"
								ref="profilePictureInput"
								type="file"
								:accept="allowedImages.join(',')"                                    
								@change="setPicture"
							/>
						</div>
						
						<div class="align-self-center ms-3">
							<p class="mb-0 fw-bold fs-7 text-black">
								Hi there,
								<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="edit-icon">
									<path d="M11.8333 3.66666H3.66667C3.04783 3.66666 2.45434 3.9125 2.01675 4.35008C1.57917 4.78767 1.33334 5.38116 1.33334 6V22.3333C1.33334 22.9522 1.57917 23.5457 2.01675 23.9832C2.45434 24.4208 3.04783 24.6667 3.66667 24.6667H20C20.6188 24.6667 21.2123 24.4208 21.6499 23.9832C22.0875 23.5457 22.3333 22.9522 22.3333 22.3333V14.1667" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M20.5833 1.91667C21.0475 1.45254 21.677 1.19179 22.3333 1.19179C22.9897 1.19179 23.6192 1.45254 24.0833 1.91667C24.5475 2.38079 24.8082 3.01029 24.8082 3.66667C24.8082 4.32304 24.5475 4.95254 24.0833 5.41667L13 16.5L8.33334 17.6667L9.5 13L20.5833 1.91667Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</p>
							<input
								class="border-0 fw-bold p-0 fs-5 w-100"
								type="text"
								v-model="profile.name" 
								@keyup="checkName"                               
								@change="setName"
								placeholder="Add name"
								:style="{ backgroundColor: '#1195A8' }"
							/>
							<div class="small text-danger" v-if="nameChecked && nameExists">Name already taken</div>									
						</div>				
					</div>
			</div>
			<div class="mt-3">
				<div class="d-flex justify-content-between align-items-center mb-3" v-if="$user.wallet">
					<div style="color: white; font-size: 20px;">
						Wallet balance: 
					</div>
					<div>
						<span  class="fw-bold text-white" :class="{ 'text-danger': $user.wallet.ethBalance == 0 }" style="font-size: 20px;">
							{{ $filters.formatUnits($user.wallet.ethBalance, 18, 4) }}
						</span>
						<span class="text-uppercase ms-2 fw-bold text-white" style="font-size: 20px;">{{ $web3.chain.symbol }}</span>		
					</div>		
				</div>
			</div>
			<div class="pb-3 border-bottom">
				<a role="button" @click="$mitt.emit('publicationCreateModal::open')">
					<div class="createPub text-center justify-content-between">
						<img src="@/assets/img/Group_44.png" class="pt-3" :style="{ maxWidth: '30%' }" />
						<div>
							<p class="fw-bold">Create new publication</p>
						</div>
					</div>
				</a>
				<PublicationCreateModal/>
			</div>
			<div class="mt-3 pb-3 border-bottom">
				<router-link to="/publications" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="25" height="25" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<path d="M4.08887 11.4187L13.9062 3.20581L23.7236 11.4187V24.3246C23.7236 24.9469 23.4938 25.5438 23.0846 25.9838C22.6755 26.4239 22.1206 26.6711 21.542 26.6711H6.27051C5.6919 26.6711 5.13699 26.4239 4.72785 25.9838C4.31872 25.5438 4.08887 24.9469 4.08887 24.3246V11.4187Z" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M10.6338 26.6711V14.9385H17.1787V26.6711" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Publications
					</div>	
				</router-link>
				<router-link to="/collection" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="25" height="25" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<path d="M21.542 5.55234H6.27051C5.06562 5.55234 4.08887 6.60292 4.08887 7.89887V24.3246C4.08887 25.6205 5.06562 26.6711 6.27051 26.6711H21.542C22.7469 26.6711 23.7236 25.6205 23.7236 24.3246V7.89887C23.7236 6.60292 22.7469 5.55234 21.542 5.55234Z" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M18.2695 3.20581V7.89887" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M9.54297 3.20581V7.89887" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M4.08887 12.5919H23.7236" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Collections
					</div>
				</router-link>	
				<router-link to="/explore" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="25" height="23" viewBox="0 0 27 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<path d="M23.7236 18.4583C23.7236 19.0806 23.4938 19.6775 23.0846 20.1175C22.6755 20.5576 22.1206 20.8048 21.542 20.8048H8.45215L4.08887 25.4979V6.72562C4.08887 6.10328 4.31872 5.50643 4.72785 5.06637C5.13699 4.62631 5.6919 4.37909 6.27051 4.37909H21.542C22.1206 4.37909 22.6755 4.62631 23.0846 5.06637C23.4938 5.50643 23.7236 6.10328 23.7236 6.72562V18.4583Z" stroke="white" stroke-width="2.18164" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						Explore
					</div>			
				</router-link>
			</div>
			<div class="mt-3">
				<router-link to="/" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="25" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M16.7256 21.018V18.018H13.7256V16.018H16.7256V13.018H18.7256V16.018H21.7256V18.018H18.7256V21.018H16.7256ZM4.72559 18.043V16.043H11.8006C11.7506 16.393 11.7296 16.7263 11.7376 17.043C11.7456 17.3596 11.7749 17.693 11.8256 18.043H4.72559ZM4.72559 14.043V12.043H14.3756C13.9923 12.3096 13.6463 12.6096 13.3376 12.943C13.0289 13.2763 12.7583 13.643 12.5256 14.043H4.72559ZM4.72559 10.043V8.04297H19.7256V10.043H4.72559ZM4.72559 6.04297V4.04297H19.7256V6.04297H4.72559Z" fill="white"/>
						</svg>
						Documentation
					</div>			
				</router-link>
				<router-link to="/" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="21" height="19" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<path d="M17.9956 1.37295C16.6656 0.752954 15.2256 0.302954 13.7256 0.0429537C13.7124 0.0425331 13.6993 0.0450012 13.6873 0.0501845C13.6752 0.0553678 13.6643 0.0631403 13.6556 0.0729539C13.4756 0.402954 13.2656 0.832954 13.1256 1.16295C11.5346 0.922954 9.91658 0.922954 8.32558 1.16295C8.18558 0.822954 7.97558 0.402954 7.78558 0.0729539C7.77558 0.0529539 7.74558 0.0429537 7.71558 0.0429537C6.21558 0.302954 4.78558 0.752954 3.44558 1.37295C3.43558 1.37295 3.42558 1.38295 3.41558 1.39295C0.695581 5.46295 -0.0544189 9.42295 0.315581 13.343C0.315581 13.363 0.325581 13.383 0.345581 13.393C2.14558 14.713 3.87558 15.513 5.58558 16.043C5.61558 16.053 5.64558 16.043 5.65558 16.023C6.05558 15.473 6.41558 14.893 6.72558 14.283C6.74558 14.243 6.72558 14.203 6.68558 14.193C6.11558 13.973 5.57558 13.713 5.04558 13.413C5.00558 13.393 5.00558 13.333 5.03558 13.303C5.14558 13.223 5.25558 13.133 5.36558 13.053C5.38558 13.033 5.41558 13.033 5.43558 13.043C8.87558 14.613 12.5856 14.613 15.9856 13.043C16.0056 13.033 16.0356 13.033 16.0556 13.053C16.1656 13.143 16.2756 13.223 16.3856 13.313C16.4256 13.343 16.4256 13.403 16.3756 13.423C15.8556 13.733 15.3056 13.983 14.7356 14.203C14.6956 14.213 14.6856 14.263 14.6956 14.293C15.0156 14.903 15.3756 15.483 15.7656 16.033C15.7956 16.043 15.8256 16.053 15.8556 16.043C17.5756 15.513 19.3056 14.713 21.1056 13.393C21.1256 13.383 21.1356 13.363 21.1356 13.343C21.5756 8.81295 20.4056 4.88295 18.0356 1.39295C18.0256 1.38295 18.0156 1.37295 17.9956 1.37295ZM7.24558 10.953C6.21558 10.953 5.35558 10.003 5.35558 8.83295C5.35558 7.66295 6.19558 6.71295 7.24558 6.71295C8.30558 6.71295 9.14558 7.67295 9.13558 8.83295C9.13558 10.003 8.29558 10.953 7.24558 10.953ZM14.2156 10.953C13.1856 10.953 12.3256 10.003 12.3256 8.83295C12.3256 7.66295 13.1656 6.71295 14.2156 6.71295C15.2756 6.71295 16.1156 7.67295 16.1056 8.83295C16.1056 10.003 15.2756 10.953 14.2156 10.953Z" fill="white"/>
						</svg>
						&nbsp;Discord
					</div>			
				</router-link>
				<router-link to="/" class="text-decoration-none text-white">
					<div class="sidebar-link px-2 py-3 text-white mb-1">
						<svg width="25" height="23" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<g clip-path="url(#clip0_451_107)">
								<path d="M12.6109 15.3381C14.2792 15.3381 15.6316 13.9857 15.6316 12.3174C15.6316 10.6491 14.2792 9.29663 12.6109 9.29663C10.9426 9.29663 9.59015 10.6491 9.59015 12.3174C9.59015 13.9857 10.9426 15.3381 12.6109 15.3381Z" stroke="white" stroke-width="2.01382" stroke-linecap="round" stroke-linejoin="round"/>
								<path d="M20.062 15.3381C19.928 15.6418 19.888 15.9787 19.9472 16.3053C20.0064 16.632 20.1622 16.9334 20.3943 17.1707L20.4547 17.2311C20.642 17.4181 20.7905 17.6402 20.8918 17.8847C20.9932 18.1292 21.0453 18.3912 21.0453 18.6559C21.0453 18.9205 20.9932 19.1826 20.8918 19.427C20.7905 19.6715 20.642 19.8936 20.4547 20.0806C20.2677 20.2679 20.0456 20.4164 19.8011 20.5178C19.5566 20.6191 19.2946 20.6713 19.0299 20.6713C18.7653 20.6713 18.5032 20.6191 18.2588 20.5178C18.0143 20.4164 17.7922 20.2679 17.6052 20.0806L17.5447 20.0202C17.3074 19.7881 17.006 19.6324 16.6794 19.5732C16.3528 19.5139 16.0159 19.5539 15.7122 19.6879C15.4143 19.8156 15.1604 20.0275 14.9815 20.2977C14.8025 20.5678 14.7065 20.8844 14.7052 21.2084V21.3796C14.7052 21.9137 14.4931 22.4259 14.1154 22.8035C13.7377 23.1812 13.2255 23.3934 12.6914 23.3934C12.1573 23.3934 11.6451 23.1812 11.2674 22.8035C10.8898 22.4259 10.6776 21.9137 10.6776 21.3796V21.2889C10.6698 20.9557 10.5619 20.6324 10.368 20.3613C10.1741 20.0901 9.90302 19.8836 9.59014 19.7685C9.28644 19.6345 8.94955 19.5945 8.62291 19.6537C8.29628 19.7129 7.99487 19.8686 7.75756 20.1008L7.69715 20.1612C7.51012 20.3484 7.28802 20.497 7.04354 20.5983C6.79907 20.6997 6.53702 20.7518 6.27237 20.7518C6.00772 20.7518 5.74567 20.6997 5.50119 20.5983C5.25672 20.497 5.03462 20.3484 4.84759 20.1612C4.66035 19.9742 4.51181 19.7521 4.41047 19.5076C4.30912 19.2631 4.25696 19.0011 4.25696 18.7364C4.25696 18.4718 4.30912 18.2097 4.41047 17.9652C4.51181 17.7208 4.66035 17.4987 4.84759 17.3116L4.908 17.2512C5.14013 17.0139 5.29585 16.7125 5.35508 16.3859C5.4143 16.0592 5.37432 15.7223 5.24028 15.4186C5.11265 15.1208 4.90071 14.8668 4.63056 14.6879C4.36042 14.509 4.04386 14.413 3.71985 14.4117H3.54867C3.01457 14.4117 2.50235 14.1996 2.12469 13.8219C1.74702 13.4442 1.53485 12.932 1.53485 12.3979C1.53485 11.8638 1.74702 11.3516 2.12469 10.9739C2.50235 10.5963 3.01457 10.3841 3.54867 10.3841H3.6393C3.97258 10.3763 4.29581 10.2684 4.56696 10.0745C4.83812 9.88053 5.04466 9.60951 5.15973 9.29662C5.29377 8.99292 5.33375 8.65603 5.27452 8.3294C5.2153 8.00276 5.05958 7.70135 4.82745 7.46404L4.76704 7.40363C4.5798 7.2166 4.43126 6.9945 4.32992 6.75002C4.22857 6.50555 4.17641 6.2435 4.17641 5.97885C4.17641 5.7142 4.22857 5.45215 4.32992 5.20768C4.43126 4.9632 4.5798 4.7411 4.76704 4.55407C4.95407 4.36683 5.17617 4.2183 5.42064 4.11695C5.66512 4.01561 5.92717 3.96344 6.19182 3.96344C6.45646 3.96344 6.71851 4.01561 6.96299 4.11695C7.20746 4.2183 7.42956 4.36683 7.61659 4.55407L7.67701 4.61449C7.91432 4.84662 8.21572 5.00233 8.54236 5.06156C8.869 5.12078 9.20589 5.0808 9.50959 4.94677H9.59014C9.88795 4.81913 10.1419 4.60719 10.3208 4.33705C10.4998 4.0669 10.5958 3.75034 10.5971 3.42633V3.25516C10.5971 2.72106 10.8092 2.20883 11.1869 1.83117C11.5646 1.4535 12.0768 1.24133 12.6109 1.24133C13.145 1.24133 13.6572 1.4535 14.0349 1.83117C14.4125 2.20883 14.6247 2.72106 14.6247 3.25516V3.34578C14.626 3.66979 14.722 3.98635 14.9009 4.25649C15.0798 4.52664 15.3338 4.73857 15.6316 4.86621C15.9353 5.00025 16.2722 5.04023 16.5988 4.98101C16.9255 4.92178 17.2269 4.76606 17.4642 4.53393L17.5246 4.47352C17.7116 4.28628 17.9337 4.13774 18.1782 4.0364C18.4227 3.93505 18.6847 3.88289 18.9494 3.88289C19.214 3.88289 19.4761 3.93505 19.7206 4.0364C19.965 4.13774 20.1871 4.28628 20.3742 4.47352C20.5614 4.66055 20.7099 4.88265 20.8113 5.12712C20.9126 5.3716 20.9648 5.63365 20.9648 5.8983C20.9648 6.16294 20.9126 6.425 20.8113 6.66947C20.7099 6.91394 20.5614 7.13605 20.3742 7.32308L20.3137 7.38349C20.0816 7.6208 19.9259 7.9222 19.8667 8.24884C19.8074 8.57548 19.8474 8.91237 19.9815 9.21607V9.29662C20.1091 9.59444 20.321 9.84843 20.5912 10.0273C20.8613 10.2062 21.1779 10.3022 21.5019 10.3035H21.6731C22.2072 10.3035 22.7194 10.5157 23.0971 10.8934C23.4747 11.271 23.6869 11.7833 23.6869 12.3174C23.6869 12.8515 23.4747 13.3637 23.0971 13.7413C22.7194 14.119 22.2072 14.3312 21.6731 14.3312H21.5825C21.2584 14.3325 20.9419 14.4285 20.6717 14.6074C20.4016 14.7863 20.1897 15.0403 20.062 15.3381V15.3381Z" stroke="white" stroke-width="2.01382" stroke-linecap="round" stroke-linejoin="round"/>
							</g>
							<defs>
								<clipPath id="clip0_451_107">
								<rect width="24.1659" height="24.1659" fill="white" transform="translate(0.527954 0.234436)"/>
								</clipPath>
							</defs>
						</svg>
						Settings
					</div>			
				</router-link>
			</div>
			<div class="mt-5">
				<a role="button" class="text-decoration-none text-white" @click.prevent="$user.logout()">
					<div class="logout-btn">
						<svg width="36" height="33" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="pb-1">
							<path d="M7.5 8H16.5C17.325 8 18 7.325 18 6.5C18 5.675 17.325 5 16.5 5H7.5C5.85 5 4.5 6.35 4.5 8V29C4.5 30.65 5.85 32 7.5 32H16.5C17.325 32 18 31.325 18 30.5C18 29.675 17.325 29 16.5 29H7.5V8Z" fill="white"/>
							<path d="M30.975 17.975L26.79 13.79C26.6857 13.6828 26.5517 13.6092 26.4053 13.5786C26.259 13.548 26.1067 13.5617 25.9682 13.6181C25.8297 13.6745 25.7111 13.7709 25.6277 13.8951C25.5443 14.0192 25.4998 14.1654 25.5 14.315V17H15C14.175 17 13.5 17.675 13.5 18.5C13.5 19.325 14.175 20 15 20H25.5V22.685C25.5 23.36 26.31 23.69 26.775 23.21L30.96 19.025C31.26 18.74 31.26 18.26 30.975 17.975Z" fill="white"/>
						</svg>
						Logout
					</div>			
				</a>
			</div>
		</div>
	</div>
	
</template>

<style lang="scss" scoped> 
	@import '@/scss/variables.scss';
	._edit_btn {
		min-width: 1.5rem;
		height: 1.5rem;
	}
	._avatar_picture {
		width: 4.5rem;
		height: 4.5rem;		
		&._md {
			width: 4.5rem;
			height: 4.5rem;
		}
		&._lg {
			width: 5rem;
			height: 5rem;
		}
	}
	.bg-img {
		background-image: url('../../assets/img/Default.png');
        background-position: center;
		min-height: 100vh;
	}
	.profile {
		background-color: #1195A8;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
	}
	.createPub {
		color: black;
		background-color: #0E92A6;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
		padding: 5px 0px;
	}
	.logo-image {
		width: 40%;
		border-radius: 7px;
	}
	.sidebar-link {
		font-size: 18px;
		font-weight: 600;
	}
	.sidebar-link:hover {
		background: #0A8FA3;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
		font-weight: 700;
	}
	.sidebar-link:active {
		background: #0A8FA3;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
		border-radius: 10px;
		font-weight: 700;
	}
	.logout-btn {
		font-weight: 400;
		font-size: 25px;
		line-height: 41px;
	}
	.edit-icon {
		padding-bottom: 5px;
		margin-left: 20px;
		margin-bottom: 10px;
		float: right;
	}
	
	.router-link-active .sidebar-link {
			background: #0A8FA3 !important;
			box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.16);
			border-radius: 10px;
			font-weight: 700;
	}
	// .sidebar {
	// 	display: none;
	// 	transition: all ease-in-out 0.3s;
	// }
	// .sidebar.visible {
	// 	display: block;
	// 	transform: translateX(0%);
	// }
</style>

<script>
	import WalletWarnings from '@/views/partials/WalletWarnings.vue'	
	import { api } from '@/api/api'	
	import { uploadFileToIPFS } from '@/api/ipfs';
	import PublicationCreateModal from '@/views/publication/PublicationCreateModal.vue';

	export default {
		components: { 
			WalletWarnings, 
			PublicationCreateModal 
		},
		data() {
			return {
				allowedImages: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
				profile: {
					name: null
				},
				nameExists: false,
				nameChecked: false,
				debounceTimer: null,
				sidebarVisible: true,
			};
		},
		mounted() {
			if (this.$user.profile?.name) {
				this.profile.name = this.$user.profile.name	
			}
		},
		
		watch: {
			"$user.profile.name": {
				handler(profile) {
					if (profile) {
						this.profile.name = this.$user.profile.name
					}
				}
			},	
		},
		computed: {
						
		},
		methods: {
			async setPicture(event) {
				event.preventDefault();
                this.gLoaderShow()
                try {                   
                    const file = Array.from(event.target.files)[0]; 

                    // Type check
                    if (!this.allowedImages.includes(file.type)) 
                        throw Error(`"${file.name}" not supported media format`)

                    // Size check                    
                    if (file.size > 1000000) 
						throw Error(`"${file.name}" image size should be less than 1MB`)

					const picture =	'ipfs://' + (await uploadFileToIPFS(file))	
                    const user = (await api.post('/user/setPicture', { picture })).data.user					
					this.$user.setUser(user)
                    
                } catch (error) {                    
                    console.log(error)
                    this.$swal({ icon: "error", title: 'Set picture', text: error.toString() });
                }
                event.target.value = '';
                this.gLoaderHide()

			},

			async checkName() {	
				if (this.profile.name?.length < 3) return
				clearTimeout(this.debounceTimer);
				const self = this
				this.debounceTimer = setTimeout(async () => {
					try {
						self.nameExists = (await api.get('/user/checkName', { params: { name: self.profile.name.trim() } })).data.exists
					} catch (error) {
						console.log('checkName', error)
					}
					self.nameChecked = true
				}, 500);		
			},
			async setName() {
				if (this.nameChecked && !this.nameExists && this.profile.name?.trim().length >= 3) {
					this.gLoaderShow();
					try {
						const user = (await api.post('/user/setName', { name: this.profile.name.trim() })).data.user
						this.$user.setUser(user)					
					} catch (error) {
						this.$swal({
							icon: 'error',
							title: 'Set name',
							text: this.gParseErrorMessage(error),
							timer: 5000,
						});
					}
					this.gLoaderHide();
				} 
				
				this.profile.name = this.$user.profile.name
				this.nameChecked = false
				this.nameExists = false
			},
			
			editProfile() {
				this.$mitt.emit('profileModal::open')
			},

			// toggleSidebar() {
			// 	this.sidebarVisible = !this.sidebarVisible;
			// }
		},
	}
</script>
