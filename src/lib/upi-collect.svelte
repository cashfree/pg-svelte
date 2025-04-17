<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';

	export let component: any;
	export let placeholder = 'your upi id';
	export let upiId = '';
	let { values = {}, ...otherProps } = $$restProps;

	if (!values.placeholder) {
		values.placeholder = placeholder;
	}

	if (!values.upiId) {
		values.upiId = upiId;
	}

	const modifiedProps = {
		...otherProps,
		values
	};
</script>

<BaseComponent
	bind:component
	type="upiCollect"
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
