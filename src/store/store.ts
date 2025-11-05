import { useCallback, useSyncExternalStore } from "react";

type Store<T> = {
	subscribe: (callback: () => void) => () => void;
	getState: () => T;
	setState: <K extends keyof T>(key: K, value: T[K]) => void;
	batch: (fn: () => void) => void;
};

export function createStore<T>(initialState: T): Store<T> {
	let state = initialState;
	let isBatching = false;
	const listeners = new Set<() => void>();

	const notify = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	return {
		subscribe: (callback: () => void) => {
			listeners.add(callback);
			return () => listeners.delete(callback);
		},

		getState: () => state,

		setState: <K extends keyof T>(key: K, value: T[K]) => {
			state = { ...state, [key]: value };
			if (!isBatching) {
				notify();
			}
		},

		batch: (fn: () => void) => {
			if (isBatching) {
				fn();
				return;
			}
			isBatching = true;
			try {
				fn();
			} finally {
				isBatching = false;
				notify();
			}
		},
	};
}

type ActionMap = Record<string, (...args: never[]) => unknown>;

export function createStoreActions<T, A extends ActionMap>(initialState: T, actions: (store: Store<T>) => A) {
	const store = createStore(initialState);
	const storeActions = actions(store);
	return {
		...store,
		storeActions,
	};
}

export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
	const getSnapshot = useCallback(() => selector(store.getState()), [store, selector]);

	return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
