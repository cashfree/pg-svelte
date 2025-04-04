<script>
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';

	export let component;
	export let size = '220px';

	// Extract props we want to modify
	let { values = {}, ...otherProps } = $$restProps;

	// Modify the values object
	if (!values.size) {
		values.size = size;
	}

	// Create a new props object with our modifications
	const modifiedProps = {
		...otherProps,
		values
	};
</script>

<BaseComponent
	bind:component
	type="upiQr"
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
	{...modifiedProps}
/>
