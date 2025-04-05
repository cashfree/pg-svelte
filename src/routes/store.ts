import { writable } from 'svelte/store';
export const paymentSessionIdStore = writable('');
export const env = writable('sandbox');
