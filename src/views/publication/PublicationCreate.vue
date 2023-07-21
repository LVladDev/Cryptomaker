<template>
    <div>
        <div class="my-2 d-flex justify-content-between">
			<div class="border-bottom w-100"></div>
		</div>
        <div class=" overflow-hidden mb-2">
			<div class="fw-bold mb-3" style="text-align: left;">Public content</div>
            <div class="row g-2">
                <div class="col-12 col-md-12"> 
                    <div class="d-flex flex-column justify-content-center h-100">
                        <div class="row mb-3" style="text-align: left;">
                            <div class="col-2 col-md-2">
                                <div class="me-3">Title*</div>
                            </div>
                            <div class="col-10 col-md-10">
                                <input
                                    class="form-control form-control-sm"
                                    placeholder="e.g. design strategy"
                                    style="border-radius: 8px; height: 44px;"
                                    type="text"
                                    v-model="publication.title"
                                    :class="{ 'is-invalid' : pubStore.isTitleInValid}"
                                    :disabled="status"           
                                />  
                                <span class="text-danger small" v-if="pubStore.isTitleInValid">{{ pubStore.isTitleInValid }}</span>   
                            </div>  
                        </div>
                        
                        <div class="row mb-3" style="text-align: left;">
                            <div class="col-2 col-md-2">
                                <div class="me-3">Price*</div>
                            </div>
                            <div class="col-10 col-md-10">
                                <div class="input-group input-group-sm">
                                    <input
                                        class="form-control"
                                        placeholder="e.g. 0,01"
                                        style="border-top-left-radius: 8px; border-bottom-left-radius: 8px; height: 44px;"
                                        type="number"
                                        v-model="publication.price"
                                        :class="{ 'is-invalid' : pubStore.isPriceInValid}"
                                        :disabled="status"
                                    >
                                    <span class="input-group-text fw-bold text-white" style="border-radius: 0px 8px 8px 0px; background-color: #4D4E4E;" id="basic-addon2">{{ $web3.chain.symbol }}</span>
                                </div>                                
                                <span class="text-danger small" v-if="pubStore.isPriceInValid">{{ pubStore.isPriceInValid }}</span> 
                            </div>     
                        </div>

                        <div class="row mb-3" style="text-align: left;">
                            <div class="col-2 col-md-2">
                                <div class="me-3">Description*</div>
                            </div>
                            <div class="col-10 col-md-10">
                                <textarea
                                    class="form-control form-control-sm"
                                    placeholder="Add publication public content here..."
                                    style="border-radius: 8px;"
                                    type="text"
                                    rows="3"
                                    v-model="publication.description"   
                                    :class="{ 'is-invalid' : pubStore.isDescriptionInValid}"    
                                    :disabled="status"             
                                >
                                </textarea>
                                <span class="text-danger small" v-if="pubStore.isDescriptionInValid">{{ pubStore.isDescriptionInValid }}</span> 
                            </div>
                        </div>
                        <div class="row mb-3" style="text-align: left;">
                            <div class="col-3 col-md-3">
                                <div class="me-3">Cover Image*</div>
                            </div>
                            <div class="col-9 col-md-9">
                                <div class="_media pointer overflow-hidden d-flex" @click="$refs.pictureImageInput.click()">
                                    <svg width="64" height="64" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="64" height="64" rx="32" fill="#F2F4F7"/>
                                        <path d="M32.6667 19.9998H26.4C24.1598 19.9998 23.0397 19.9998 22.184 20.4358C21.4314 20.8193 20.8195 21.4312 20.436 22.1839C20 23.0395 20 24.1596 20 26.3998V37.5998C20 39.84 20 40.9602 20.436 41.8158C20.8195 42.5685 21.4314 43.1804 22.184 43.5639C23.0397 43.9998 24.1598 43.9998 26.4 43.9998H38.6667C39.9066 43.9998 40.5266 43.9998 41.0353 43.8635C42.4156 43.4937 43.4938 42.4155 43.8637 41.0351C44 40.5264 44 39.9065 44 38.6665M41.3333 26.6665V18.6665M37.3333 22.6665H45.3333M30 27.3332C30 28.8059 28.8061 29.9998 27.3333 29.9998C25.8606 29.9998 24.6667 28.8059 24.6667 27.3332C24.6667 25.8604 25.8606 24.6665 27.3333 24.6665C28.8061 24.6665 30 25.8604 30 27.3332ZM35.9867 31.8907L24.7082 42.1439C24.0738 42.7206 23.7566 43.009 23.7286 43.2588C23.7043 43.4753 23.7873 43.69 23.9509 43.8339C24.1397 43.9998 24.5684 43.9998 25.4257 43.9998H37.9413C39.8602 43.9998 40.8196 43.9998 41.5732 43.6775C42.5193 43.2728 43.2729 42.5191 43.6776 41.5731C44 40.8195 44 39.86 44 37.9411C44 37.2955 44 36.9727 43.9294 36.672C43.8407 36.2942 43.6706 35.9403 43.431 35.635C43.2403 35.3921 42.9883 35.1904 42.4841 34.7871L38.7544 31.8034C38.2499 31.3997 37.9976 31.1979 37.7197 31.1267C37.4748 31.0639 37.2172 31.072 36.9767 31.1501C36.7039 31.2387 36.4648 31.456 35.9867 31.8907Z" stroke="#475467" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div style="width: 88%" class="border rounded d-flex justify-content-center align-items-center">
                                        <p v-if="!publication.picture" class="m-0">
                                            <span class="fw-bold" style="color: #3DA4AC">Click to upload</span>
                                            or drag and dropdown<br/>
                                            SVG, PNG, JPG or GIF(max. 800x400px)
                                        </p>
                                        <img class="_audio_cover" v-if="publication.picture" :src="publication.picture.preview" alt="" style="max-height: 70px;">
                                        <input
                                            class="_hidden"
                                            ref="pictureImageInput"
                                            type="file"
                                            :accept="pubStore.ALLOWED_IMAGE_TYPES.join(',')"                                    
                                            @change="handlePictureImage"
                                            :disabled="status"
                                        />  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        </div>

        <div class="my-2 d-flex justify-content-between align-items-center text-nowrap">
			<div class="border-bottom w-100 mx-2"></div>
		</div>
        <div>
            <div class="fw-bold mb-3" style="text-align: left;">Private content</div>
            <div class="row mb-3" style="text-align: left;">
                <div class="col-2 col-md-2">
                    <div class="me-3">Description</div>
                </div>
                <div class="col-10 col-md-10">
                    <textarea
                        class="form-control form-control-sm"
                        placeholder="Add publication private content here..."
                        style="border-radius: 8px;"
                        type="text"
                        rows="3"
                        :disabled="status"
                        v-model="publication.content"
                        :class="{ 'is-invalid' : pubStore.isContentInValid}"
                    >
                    </textarea>
                    <span class="text-danger small" v-if="pubStore.isContentInValid">{{ pubStore.isContentInValid }}</span> 
                </div>
            </div>
            <div class="row mb-3" style="text-align: left;">
                <div class="col-3 col-md-3">
                    <div class="me-3">Attachments</div>
                </div>
                <div class="col-9 col-md-9">
                    <div class="dropdown p-1 me-3 d-flex" v-tooltip data-bs-title="Media attachments" style="width: 100%">
                        <svg width="64" height="64" viewBox="0 0 64 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="64" height="64" rx="32" fill="#F2F4F7"/>
                            <path d="M32.6667 19.9998H26.4C24.1598 19.9998 23.0397 19.9998 22.184 20.4358C21.4314 20.8193 20.8195 21.4312 20.436 22.1839C20 23.0395 20 24.1596 20 26.3998V37.5998C20 39.84 20 40.9602 20.436 41.8158C20.8195 42.5685 21.4314 43.1804 22.184 43.5639C23.0397 43.9998 24.1598 43.9998 26.4 43.9998H38.6667C39.9066 43.9998 40.5266 43.9998 41.0353 43.8635C42.4156 43.4937 43.4938 42.4155 43.8637 41.0351C44 40.5264 44 39.9065 44 38.6665M41.3333 26.6665V18.6665M37.3333 22.6665H45.3333M30 27.3332C30 28.8059 28.8061 29.9998 27.3333 29.9998C25.8606 29.9998 24.6667 28.8059 24.6667 27.3332C24.6667 25.8604 25.8606 24.6665 27.3333 24.6665C28.8061 24.6665 30 25.8604 30 27.3332ZM35.9867 31.8907L24.7082 42.1439C24.0738 42.7206 23.7566 43.009 23.7286 43.2588C23.7043 43.4753 23.7873 43.69 23.9509 43.8339C24.1397 43.9998 24.5684 43.9998 25.4257 43.9998H37.9413C39.8602 43.9998 40.8196 43.9998 41.5732 43.6775C42.5193 43.2728 43.2729 42.5191 43.6776 41.5731C44 40.8195 44 39.86 44 37.9411C44 37.2955 44 36.9727 43.9294 36.672C43.8407 36.2942 43.6706 35.9403 43.431 35.635C43.2403 35.3921 42.9883 35.1904 42.4841 34.7871L38.7544 31.8034C38.2499 31.3997 37.9976 31.1979 37.7197 31.1267C37.4748 31.0639 37.2172 31.072 36.9767 31.1501C36.7039 31.2387 36.4648 31.456 35.9867 31.8907Z" stroke="#475467" stroke-width="2.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div style="width: 90%" class="border rounded text-center">
                            <button class="attach_dropdown_btn" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" :disabled="status">
                                <p class="m-0 text-black">
                                    <span class="fw-bold" style="color: #3DA4AC">Click to upload</span>
                                    or drag and dropdown<br/>
                                    SVG, PNG, JPG or GIF(max. 800x400px)
                                </p>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button class="dropdown-item d-flex align-items-center" type="button"
                                        @click="$refs.imageInput.click()" 
                                        :disabled="pubStore.imageUploadDisabled"
                                        >
                                        <div class="_icon_editor_upload_image bg-primary me-3"></div>
                                        Upload images 
                                        <span class="small text-secondary ms-2">(up to {{ pubStore.attachmentsMaxCount.image }} images)</span>
                                    </button>
                                    <input
                                        class="_hidden"
                                        ref="imageInput"
                                        type="file"
                                        multiple
                                        :accept="pubStore.ALLOWED_IMAGE_TYPES.join(',')"                                    
                                        @change="handleAttachment"
                                        :disabled="pubStore.imageUploadDisabled"
                                    />
                                </li>
                                <li>
                                    <button class="dropdown-item d-flex align-items-center" type="button"
                                        @click="$refs.videoInput.click()"
                                        :disabled="pubStore.videoUploadDisabled" 
                                        >
                                        <div class="_icon_editor_upload_video bg-primary me-3"></div>
                                        Upload video
                                        <span class="small text-secondary ms-2">(or {{ pubStore.attachmentsMaxCount.video }} video)</span>
                                    </button>
                                    <input
                                        class="_hidden"
                                        ref="videoInput"
                                        type="file"
                                        :accept="pubStore.ALLOWED_VIDEO_TYPES.join(',')"                                    
                                        @change="handleAttachment"
                                        :disabled="pubStore.videoUploadDisabled"
                                    />
                                </li>
                                <li v-if="false">
                                    <button class="dropdown-item d-flex align-items-center" type="button"
                                        @click="$refs.audioInput.click()" 
                                        :disabled="pubStore.audioUploadDisabled"
                                        >
                                        <div class="_icon_editor_upload_audio bg-primary me-3"></div>
                                        Upload audio
                                        <span class="small text-secondary ms-2">(or {{ pubStore.attachmentsMaxCount.audio }} audio)</span>
                                    </button>
                                    <input
                                        class="_hidden"
                                        ref="audioInput"
                                        type="file"
                                        multiple
                                        :accept="pubStore.ALLOWED_AUDIO_TYPES.join(',')"                                    
                                        @change="handleAttachment"
                                        :disabled="pubStore.audioUploadDisabled"
                                    />
                                </li>                       
                            </ul>
                        </div> 
                    </div>
                    
                </div>
            </div>
        </div>
        <!-- v-model="publication.description"   
        :class="{ 'is-invalid' : pubStore.isDescriptionInValid}"  -->
        <!-- <LexicalComposer :initial-config="config" ref="editor">
            <div class="mb-2">
                <ToolbarPlugin class="mb-2"/>
                <div className="editor-inner">
                    <LexicalRichTextPlugin>
                        <template #contentEditable>
                            <LexicalContentEditable class="editor-input" />
                        </template>
                        <template #placeholder>
                            <div class="editor-placeholder">
                                Add publication private content here...
                            </div>
                        </template>
                    </LexicalRichTextPlugin>
                    <LexicalOnChangePlugin @change="onChange"/>
                    <LexicalHistoryPlugin />
                    <LexicalAutoFocusPlugin />
                </div>
            </div>
        </LexicalComposer> -->

        <div v-if="status" class="row">
            <div class="col-md-6">
                <button v-if="status" type="button" class="cancel_btn btn btn-info" @click="handleClickCancel">
                    Cancel
                </button>
            </div>
            <div class="col-md-6">
                <button type="button" class="btn btn-info next_btn"
                    @click="post()"
                    >
                    Post
                </button> 
            </div>
        </div>
        <div v-else class="row">
            <div class="col-md-6">
                <button v-if="!status" type="button" @click="closeModal()" class="cancel_btn btn btn-info">
                    Cancel
                </button>
            </div>
            <div class="col-md-6">
                <button v-if="!status" @click="handleClickNext()" :disabled="!pubStore.isPublicationValid" type="button" class="btn btn-info next_btn">
                    Next
                </button>
            </div>
        </div>
        
        <div class="border rounded overflow-hidden" v-if="false && pubStore.isAudioPublication">
            <div class="row g-2">
                <!-- image -->
                <div class="col-12 col-md-4">                    
                    <div class=" h-100">
                        <div class="_media pointer" @click="$refs.audioImageInput.click()">
                            <img class="_audio_cover " v-if="publication.attachments[1]" :src="publication.attachments[1].preview" alt="">
                            <div class="btn btn-primary d-flex justify-content-center align-items-center h-100 w-100 position-absolute start-0 top-0" v-if="!publication.attachments[1]">
                                <div class="_icon_editor_upload_image bg-white me-3"></div>
                                Add cover image    
                            </div>    
                            <div class="mx-3 mt-3 position-absolute end-0 top-0 p-2 bg-white bg-opacity-75 rounded-circle" v-if="publication.attachments[1]">                        
                                <div class="_icon_editor_upload_image bg-primary" :class="{ 'bg-danger': publication.attachments[1].ipfsError }"></div>
                            </div>                    
                        </div>
                    </div>                    
                    <input
                        class="_hidden"
                        ref="audioImageInput"
                        type="file"
                        :accept="pubStore.ALLOWED_IMAGE_TYPES.join(',')"                                    
                        @change="handleCoverAttachment"                    
                    />
                </div>
                <div class="col-12 col-md-8"> 
                    <div class="d-flex align-items-center px-3 mt-2 mt-md-4" >
                        <span class="fw-bold me-3">Author</span>
                        <input type="text" class="form-control form-control-sm" 
                            placeholder="audio author name..." 
                            v-model="publication.author"                 
                            :class="{ 'is-invalid' : !publication.author}" 
                        >  
                        <a class="d-flex align-items-center bg-white bg-opacity-75 text-decoration-none rounded ms-3" href="#" role="button" 
                            @click.prevent="publication.attachments = []"  
                            >                        
                            <div class="_icon_close bg-primary" :class="{ 'bg-danger': publication.attachments[0].ipfsError }"></div>
                        </a>              
                    </div>  
                    <div class="px-2  mt-2 mt-md-3">
                        <Plyr :options="{ controls: ['play', 'progress', 'current-time', 'mute', 'volume'] }" >
                            <audio  controls crossorigin playsinline>
                                <source :src="publication.attachments[0].preview" :type="publication.attachments[0].type">
                            </audio>
                        </Plyr>    
                    </div> 
                </div>            
            </div>
        </div>
        
        <div class="mt-2" v-if="publication.attachments.length">
            <div class="row g-2 row-cols-1" :class="{ 'row-cols-lg-2': publication.attachments.length > 1}">
                <div class="col" v-for="attachment in publication.attachments">
                    <div class="_media">
                        <img class="_image border rounded" v-if="attachment.type.includes('image')" :src="attachment.preview" alt="">

                        <div class="_video border rounded" v-if="attachment.type.includes('video')">
                            <Plyr>
                                <video controls>
                                    <source :src="attachment.preview" :type="attachment.type">
                                </video>
                            </Plyr>
                        </div>
                                            
                        <a class="d-flex align-items-center mx-3 mt-3 position-absolute end-0 top-0 p-2 bg-white bg-opacity-75 text-decoration-none rounded-circle" href="#" role="button" 
                            @click.prevent="removeAttachments([attachment.id])"  
                            >                        
                            <div class="text-danger fw-bold small me-2 text-center" v-if="attachment.ipfsError">
                                This media not uploaded, try again or remove it                              
                            </div>
                            <div class="_icon_close bg-primary" :class="{ 'bg-danger': attachment.ipfsError }"></div>
                        </a>                          
                    </div>
                </div>
            </div>    
        </div>
        
    </div>    
</template>

<style lang="scss" scoped>
    ._media {
        position: relative;
        min-height: 4.5rem;
        height: 100%;
        width: 100%;
        ._image, ._video, ._audio, ._audio_cover {            
            width: 100%;
            height: 100%;
            overflow: hidden;
            object-fit: cover;
        }    
        ._audio {            
            height: 7rem;
        }
        ._audio_cover{
            max-height: 8rem;
        }
    }
    .attach_dropdown_btn {
        width: 100%;
        height: 100%;
        border: none;
        background: none;
    }
    .cancel_btn {
        width: 100%;
        background-color: white;
        color: #3DA4AC;
        border: 1px solid #3DA4AC;
    }
    .cancel_btn:hover {
        background-color: #3DA4AC;
        color: white;
    }
    .next_btn {
        width: 100%;
        background-color: #3DA4AC;
        color: white;
    }
</style>

<script>
    import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
    import { LexicalAutoFocusPlugin, LexicalComposer, LexicalContentEditable, LexicalHistoryPlugin, LexicalOnChangePlugin, LexicalRichTextPlugin } from 'lexical-vue'
    import theme from './theme'
    import ToolbarPlugin from './ToolbarPlugin.vue'
    import WalletWarnings from '@/views/partials/WalletWarnings.vue'    
    import { v4 as uuidv4 } from 'uuid'; 
    import { publicationStore } from '@/store/publication.store'    
    import Plyr from '@/views/components/Plyr.vue'
    	

    export default {
        components: {           
            LexicalAutoFocusPlugin,
            LexicalComposer,
            LexicalContentEditable,
            LexicalHistoryPlugin,
            LexicalOnChangePlugin,
            LexicalRichTextPlugin,
            ToolbarPlugin, 
            WalletWarnings,
            Plyr
        },
        props: {
            mode: { type: String, default: 'post' },
            closeModal: {
                type: Function,
                required: true
            },
        },
        data() {
            return { 
                modalId: 'publicationCreateModal',
				modalOpened: false,	
                config: {
                    theme,
                    editable: true,
                    onError: (error) => {
                        console.error(error)
                    },
                    editorState: () => {
                        $convertFromMarkdownString('')
                    },
                    updateContent(content) {
                        $convertFromMarkdownString(content)
                    }
                },
                pubStore: publicationStore(),
                publication: publicationStore().publication,
                locationOrigin: location.origin,
                status: false,
            }
        },
        computed: {     
            
        },
        async mounted() {          
        },  
        beforeUnmount() {	            	
		},
        methods: {  
            // editor
            onChange(editorState) {
                const self = this
                editorState.read(() => { self.publication.content = $convertToMarkdownString(TRANSFORMERS) })
            },
            // attachments    
            handleCoverAttachment(event) {
                if (this.publication.attachments[1]) {
                    this.publication.attachments.pop()
                }
                this.handleAttachment(event)
            }, 
            async handlePictureImage(event) {
				event.preventDefault();
                try {                   
                    const file = Array.from(event.target.files)[0]; 

                    // Type check
                    if (!this.pubStore.ALLOWED_MEDIA_TYPES.includes(file.type)) 
                        throw Error(`"${file.name}" not supported media format`)

                    // Size check                    
                    if (file.size > 1000000) 
						throw Error(`"${file.name}" image size should be less than 1MB`)

                    this.publication.picture = {
                        id: uuidv4(),
                        type: file.type,
                        preview: URL.createObjectURL(file),
                        file,
                    }                    
                } catch (error) {                    
                    console.log(error)
                    this.$swal({ icon: "error", title: 'Cover picture', text: error.toString() });
                }
                event.target.value = '';
                this.gLoaderHide()

			},  
            async handleAttachment(event) {
                event.preventDefault();
                this.gLoaderShow()
                try {
                    const files = Array.from(event.target.files)
                    let errorMsg = ''                    
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const isImage = file.type.includes('image')
                        const isVideo = file.type.includes('video')
                        const isAudio = file.type.includes('audio')                        
                        // Type check
                        if (!this.pubStore.ALLOWED_MEDIA_TYPES.includes(file.type)) {
                            throw Error(`"${file.name}" not supported media format`)
                        }                                                               
                        // Count check  
                        
                        if (this.pubStore.isAudioPublication) {
                            if (!isImage || this.publication.attachments.length >= 2) {
                                throw Error(`Only one cover image allowed with audio publicatin`)
                            }
                        } else {
                            if ((isImage && this.pubStore.imageUploadDisabled) 
                                || (isVideo && this.videoUploadDisabled) 
                                || (isAudio && this.audioUploadDisabled)) {
                                throw Error(`Allowed up to ${this.pubStore.attachmentsMaxCount.image} images or ${this.pubStore.attachmentsMaxCount.video} video or ${this.pubStore.attachmentsMaxCount.audio} audio`)
                            }    
                        }                      
                          
                        // Size check
                        //let status = 'OK'  
                        if (isImage && file.size > this.pubStore.attachmentsMaxSize.image) throw Error(`"${file.name}" image size should be less than ${this.pubStore.attachmentsMaxSize.image / 1000000 }MB`)
                        if (isVideo && file.size > this.pubStore.attachmentsMaxSize.video) throw Error(`"${file.name}" video size should be less than ${this.pubStore.attachmentsMaxSize.video / 1000000 }MB`)
                        if (isAudio && file.size > this.pubStore.attachmentsMaxSize.audio) throw Error(`"${file.name}" audio size should be less than ${this.pubStore.attachmentsMaxSize.audio / 1000000 }MB`)
 
                        this.publication.attachments.push({
                            id: uuidv4(),
                            type: file.type,
                            preview: URL.createObjectURL(file),
                            file,
                        })
                    }
                    if (errorMsg.length) this.$swal({ icon: "error", title: 'Media attach', text: errorMsg });  
                } catch (error) {                    
                    console.log(error)
                    this.$swal({ icon: "error", title: 'Media attach', text: error.toString() });
                }
                event.target.value = '';
                this.gLoaderHide()
            },    

            removeAttachments(attachmentIds){
                attachmentIds.map((id) => {
                    const index = this.publication.attachments.findIndex((a) => a.id === id);
                    if (index !== -1) this.publication.attachments.splice(index, 1);                    
                });
            },
                       
            async post() {
                this.gLoaderShow()
                try {
                    const publication = await this.pubStore.preparePublicationData() 
                    
                    this.$mitt.emit("campaigns::publications::add", publication)                       
                    this.$mitt.emit('publicationCreateModal::close')                       
					this.pubStore.resetPublication()     
                    
                    try {
                        this.$router.push({ name: 'publications' })
                    } catch (error) { }
                } catch (error) {                    
                    console.log(error)
                    this.$swal({ icon: "error", title: 'Publication', text: error.toString() });
                }                
                this.gLoaderHide()
            },

            handleClickNext() {
                this.status = true
            },

            handleClickCancel() {
                this.status = false
            }
        },
    }

    
</script>