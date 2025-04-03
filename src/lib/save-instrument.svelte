<script>
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';

	export let component;
</script>

<BaseComponent
	bind:component
	type="savePaymentInstrument"
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
