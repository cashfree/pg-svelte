<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import BaseComponent from './base-component.svelte';

	export let component: any;
	export let placeholder = '4XXX XXXX XXXX 4321';
	export let hideBrandIcon = false;
	let { values = {}, ...otherProps } = $$restProps;

	if (!values.placeholder) {
		values.placeholder = placeholder;
	}
	if (
		!values.hideBrandIcon &&
		!!hideBrandIcon &&
		(hideBrandIcon === true || hideBrandIcon === 'true')
	) {
		values.hideBrandIcon = true;
	}
	const modifiedProps = {
		...otherProps,
		values
	};
</script>

<BaseComponent
	bind:component
	type="cardNumber"
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
