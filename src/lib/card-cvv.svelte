<script lang="ts">
	import BaseComponent from './base-component.svelte';

	// Any props not explicitly defined above will be available in $$restProps
	export let component: any;
</script>

<BaseComponent
	bind:component
	type="cardCvv"
	on:ready
	on:focus
	on:blur
	on:invalid
	on:change
	on:empty
	on:complete
	on:click
	on:paymentrequested
	on:loaderror
	{...$$restProps}
/>
