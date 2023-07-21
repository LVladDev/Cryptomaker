<template>	
	<div class="row g-1 row-cols-1 mb-2" v-if="$web3.account.address && !gIsTxAllowed">
		<!-- Info -->
		<div class="col">
			<div class="d-grid gap-2">
				<button v-if="!$web3.chainValid" type="button"
					class="btn btn-outline-danger btn-sm" @click="gSwitchChain()">
					Wrong chain connected <br> Switch to {{ $web3.chain.name }} chain
				</button>	
			</div>				
		</div>				
	</div>	
</template>

<script>
    export default {
        
    };
</script>
