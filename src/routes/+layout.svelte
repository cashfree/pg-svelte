<script>
	import '../app.css';
	import '../demo.css';
	import { onMount } from 'svelte';
	import { paymentSessionIdStore } from './store';

	// State for mobile sidebar toggle
	let sidebarOpen = false;
	let isMobile = false;

	// Define variables you want to share with pages
	let paymentSessionId = 'payment-session-id';

	$: {
		// Update the context whenever paymentSessionId changes
		paymentSessionIdStore.set(paymentSessionId);
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
</script>

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
				<img src="/pg-svelte.png" alt="" class="w-32" />
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
			<ul class="space-y-2">
				<li>
					<a
						href="/cards"
						class="flex text-sm font-medium items-center space-x-2 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
					>
						<span>Cards</span>
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
				<div class="flex-1 px-4 md:px-8">
					<div class="relative">
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
