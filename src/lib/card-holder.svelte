<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';

	export let component: any;
	export let placeholder = 'Name on Card';
	let { values = {}, ...otherProps } = $$restProps;
	if (!values.placeholder) {
		values.placeholder = placeholder;
	}

	const modifiedProps = {
		...otherProps,
		values
	};
</script>

<BaseComponent
	bind:component
	type="cardHolder"
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
