<template>    
    <Modal :modal-id="modalId" :modal-class="`modal-lg multi ${opened && 'opened'}`" >		
        <template v-slot:body>      
            <div v-if="opened">
                <!-- Header -->                                
                <div class="d-flex justify-content-between mb-2">                    
                    <div class="d-flex">
                        <div class="p-2">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M25.5 28.83H7.5V10.5H18V7.5H4.5V31.5H28.5V18H25.5V28.83Z" fill="black"/>
                                <path d="M28.5 3H25.5V7.5H21C21.015 7.515 21 10.5 21 10.5H25.5V14.985C25.515 15 28.5 14.985 28.5 14.985V10.5H33V7.5H28.5V3ZM10.5 13.5H22.5V16.5H10.5V13.5ZM10.5 18V21H22.5V18H18H10.5ZM10.5 22.5H22.5V25.5H10.5V22.5Z" fill="black"/>
                            </svg>
                        </div>
                        <div style="text-align: left;">
                            <p class="fw-bold fs-5 mb-0">Create new publication</p>
                            <p class="mb-0" style="font-size: 14px;">Create your new publication in less than 5 minutes.</p>
                        </div>
                    </div>
                    <button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close" @click="closeModal()"></button>	
                </div>
                <PublicationCreate :mode="'post'" :close-modal="closeModal"/>
            </div>    
        </template>
    </Modal>  
</template>

<style lang="scss" scoped>      
</style>

<script>
    import Modal from '@/views/components/Modal.vue'	
    import PublicationCreate from '@/views/publication/PublicationCreate.vue'    
    import { publicationStore } from '@/store/publication.store'
        
    export default {
        components: {
            Modal,
            PublicationCreate,
        },
        data() {
            return {
                modalId: 'publicationCreateModal',
				publication: publicationStore().publication,
                opened: false
            }
        },
        async mounted() {  
            this.$mitt.on(this.modalId + "::open", this.openModal)
			this.$mitt.on(this.modalId + "::close", this.closeModal)
        },  
        beforeUnmount() {
			this.$mitt.off(this.modalId + "::open")
			this.$mitt.off(this.modalId + "::close")
        },
        methods: {
            openModal() { 
                publicationStore().resetPublication()
                if (!this.publication.title) this.publication.title = `Public title @${this.$user.profile.name}`
                if (!this.publication.description) this.publication.description = `Public description by @${this.$user.profile.name}`
                
                this.opened = true
                this.$mitt.emit('modal::open::' + this.modalId) 
            },
            closeModal() { 
                this.opened = false
                this.$mitt.emit('modal::close::' + this.modalId) 
            }         
        },
    }
</script>