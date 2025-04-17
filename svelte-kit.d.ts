// Type definitions for SvelteKit modules
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
	// Named exports for the components
	export const CardNumber: any;
	export const CardExpiry: any;
	export const CardHolder: any;
	export const CardCVV: any;
	export const SaveInstrument: any;
	export const UPIQRCode: any;
	export const UPIAPP: any;
	export const UPICollect: any;
	export const Netbanking: any;
	export const Wallet: any;
	export const Root: any;
}

declare module '$lib/netbanking-list' {
	interface NetbankingItem {
		netbankingBankName: string;
		netbankingBankDisplay: string;
	}
	const netbankingList: NetbankingItem[];
	export default netbankingList;
}
