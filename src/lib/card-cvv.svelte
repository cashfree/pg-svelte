<script>
	import BaseComponent from './base-component.svelte';

	// If you need to export any specific props or modify them before passing them down
	// export let specificProp = defaultValue;

	// Any props not explicitly defined above will be available in $$restProps
	export let component;
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
