// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

// This file provides type declarations for SvelteKit modules
declare module '$app/paths' {
	export const base: string;
	export const assets: string;
}

declare module '$app/stores' {
	import { Readable } from 'svelte/store';

	export interface Page {
		url: URL;
		params: Record<string, string>;
		routeId: string | null;
		status: number;
		error: Error | null;
		data: Record<string, any>;
	}

	export const page: Readable<Page>;
	export const navigating: Readable<{
		from: URL | null;
		to: URL | null;
	} | null>;
}

declare module '$app/navigation' {
	interface NavigationResult {
		type: 'link' | 'popstate';
		from: {
			url: URL;
			route: { id: string | null };
		};
		to: {
			url: URL;
			route: { id: string | null };
		};
	}

	export function afterNavigate(callback: (navigation: NavigationResult) => void): void;
	export function beforeNavigate(callback: (navigation: NavigationResult) => boolean | void): void;
	export function goto(
		url: string | URL,
		options?: { replaceState?: boolean; noscroll?: boolean; keepfocus?: boolean; state?: any }
	): Promise<void>;
	export function invalidate(resource: string): Promise<void>;
	export function invalidateAll(): Promise<void>;
	export function preloadData(url: string | URL): Promise<void>;
	export function prefetch(url: string | URL): Promise<void>;
	export function prefetchRoutes(routes?: string[]): Promise<void>;
}

declare module '$lib' {
	// Export everything from your library index
	import * as CashfreeComponents from '/Users/raj/pg-svelte/src/lib/index';
	export = CashfreeComponents;
}

declare module '$lib/netbanking-list' {
	interface NetbankingItem {
		netbankingBankName: string;
		netbankingBankDisplay: string;
	}
	const netbankingList: NetbankingItem[];
	export default netbankingList;
}
