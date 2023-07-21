<template>
    <div>
        <div class="row">
			<div class="d-flex align-items-center mb-2">
                <router-link to="/publications" class="text-decoration-none title-text text-black fs-1 mt-3">
                    &lt;
                </router-link>
				<div class="fs-4 fw-bold" style="margin: 1.3rem 0 0 10px;">My Publications</div>  
			</div>
		</div>
        <div class="row d-flex mt-3">
            <img class="myPubCard-img p-0" src="@/assets/img/avatar.jpg" alt="">
            <div class="desc-section">
                <div class="fw-bold fs-3 mb-1 d-flex">
                    Design Strategy
                    <div style="width: 73%;" class="center-div"></div>
                    <div class="text-center p-2 m-2 bg bg-opacity-75 align-items-center justify-content-center d-flex fs-6 text-primary ribbon-encId"># 247-258</div>
                </div>
                <div class="mb-3">
                    <span class="me-2 fw-bold fs-5">Description:</span>
                    <br/>
                    <br/>
                    <span class="fs-5">
                        Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. 
                        Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                    </span>
                </div>
            </div>
            <div class="m-3"> 
                <span class="me-2 fs-3">Price:</span>
                <span class="fw-bold fs-3">
                    0.01 ETH
                </span>
                <div class="my-2 d-flex justify-content-between">
                    <div class="border-bottom" style="width: 98%; border: solid 1px black;"></div>
                </div>
            </div>
        </div>
        <div class="m-3">
            <div class="fw-bold fs-5 mb-3 d-flex">
                Private content
            </div>
            <div class="mb-3">
                <span class="me-2 fw-bold fs-5">Description:</span>
                <br/>
                <br/>
                <span class="fs-5">
                    Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. 
                    Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.
                </span>
            </div>
            <div class="mb-3">
                <span class="me-2 fw-bold fs-5">Files attached:</span>
                <br/>
                <br/>
                <div style="width: 40%" class="border rounded d-flex justify-content-center align-items-center">
                    <p class="m-0">
                        <span class="fw-bold" style="color: #3DA4AC">Click to upload</span>
                        or drag and dropdown<br/>
                        SVG, PNG, JPG or GIF(max. 800x400px)
                    </p>
                    <input
                        class="_hidden"
                        ref="pictureImageInput"
                        type="file"
                    />  
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .myPubCard-img {
        border-radius: 25px;
        max-width: 20%;
        height: 100%;
        margin: 0 20px;
    }
    .desc-section {
        width: 76%
    }
    .ribbon-encId {
        background-color: #3DA4AC;
        color: white !important;
        border-radius: 5px !important;
    }
    @media screen and (max-width: 1240px) {
        .myPubCard-img {
            border-radius: 25px;
            max-width: 25%;
            height: 100%;
            margin: 0 20px;
        }
        .desc-section {
            width: 60%
        }
        .ribbon-encId {
            background-color: #3DA4AC;
            color: white !important;
            border-radius: 5px !important;
            width: 40%;
            max-height: 40px;
        }
        .center-div {
            width: 5% !important;
        }
    }
</style>