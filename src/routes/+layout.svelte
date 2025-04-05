<script>
	import '../app.css';
	import '../demo.css';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { paymentSessionIdStore, env } from './store';
	import { afterNavigate } from '$app/navigation';

	// State for mobile sidebar toggle
	let sidebarOpen = false;
	let isMobile = false;

	// Define variables you want to share with pages
	let paymentSessionId = 'payment-session-id';
	let mode = 'sandbox';

	$: {
		// Update the context whenever paymentSessionId changes
		paymentSessionIdStore.set(paymentSessionId);
		console.log('>>>>>>----  +layout:21 ', mode);
		env.set(mode);
	}

	// Make variables available to child pages

	// For reactive values, use a getter function

	// Toggle sidebar function
	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// Check screen size on mount and when resized
	onMount(() => {
		const checkScreenSize = () => {
			isMobile = window.innerWidth < 768;
			sidebarOpen = !isMobile;
		};

		// Initial check
		checkScreenSize();

		// Listen for resize
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	});

	let activeTab = '';

	afterNavigate((e) => {
		activeTab = e.to.route.id;
		console.log('>>>>>>----  +layout:53 ', activeTab);
	});
</script>

<svelte:head>
	<title>Cashfree PG Svelte</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-gray-100">
	<!-- Sidebar Backdrop (Mobile) -->
	{#if sidebarOpen && isMobile}
		<div
			class="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
			on:click={toggleSidebar}
		></div>
	{/if}

	<!-- Sidebar -->
	<aside
		class="fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-indigo-200 shadow-lg transition duration-300 ease-in-out md:relative md:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<!-- Sidebar Header -->
		<div class="flex items-center justify-between border-b border-indigo-300 p-4">
			<div class="flex items-center space-x-2">
				<a href="{base}/">
					<img src="/pg-svelte.png" alt="" class="w-32" />
				</a>
			</div>
			<button class="md:hidden" on:click={toggleSidebar}>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</button>
		</div>

		<!-- Sidebar Links -->
		<nav class="p-4">
			<ul class="gap-y-3 flex flex-col">
				<li>
					<a
						href="/cards"
						class:bg-gray-100={activeTab.includes('/cards')}
						class="flex text-sm font-medium items-center space-x-2 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
					>
						<span>Cards</span>
					</a>
					<a
						href="/upi-qr"
						class:bg-gray-100={activeTab.includes('/upi-qr')}
						class="flex text-sm font-medium items-center space-x-2 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
					>
						<span>UPI QR</span>
					</a>
					<a
						href="/upi-app"
						class:bg-gray-100={activeTab.includes('/upi-app')}
						class="flex text-sm font-medium items-center space-x-2 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
					>
						<span>UPI APP</span>
					</a>
					<a
						href="/upi-collect"
						class:bg-gray-100={activeTab.includes('/upi-collect')}
						class="flex text-sm font-medium items-center space-x-2 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
					>
						<span>UPI Collect</span>
					</a>
				</li>
			</ul>
		</nav>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top Navigation -->
		<header class="bg-white border-b shadow-sm">
			<div class="flex items-center justify-between px-6 py-3">
				<!-- Mobile Menu Button -->
				<button class="text-gray-500 md:hidden" on:click={toggleSidebar}>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</button>

				<!-- Search -->
				<div class="grid grid-cols-6 gap-x-2 px-4 md:px-8">
					<div class="relative col-span-1">
						<select
							bind:value={mode}
							class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
						>
							<option value="sandbox">Sandbox</option>
							<option value="production">Production</option>
						</select>
					</div>
					<div class="relative col-span-5">
						<input
							type="text"
							class="input-text w-full pl-10"
							placeholder="enter a payment session id ex: session_some_thing"
							bind:value={paymentSessionId}
						/>
					</div>
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
			<slot />
		</main>
	</div>
</div>
