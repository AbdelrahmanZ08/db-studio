import { useMemo } from "react";

import { useLazyRef } from "@/hooks/use-lazy-ref";
import type { DataGridState, RowHeightValue } from "@/types/data-grid.type";
import { useStore } from "./store";

interface DataGridStore {
	subscribe: (callback: () => void) => () => void;
	getState: () => DataGridState;
	setState: <K extends keyof DataGridState>(key: K, value: DataGridState[K]) => void;
	notify: () => void;
	batch: (fn: () => void) => void;
}

export const useDataGridStore = ({
	initialState,
	rowHeightProp,
}: {
	initialState: DataGridState;
	rowHeightProp: RowHeightValue;
}) => {
	const listenersRef = useLazyRef(() => new Set<() => void>());

	const stateRef = useLazyRef<DataGridState>(() => {
		return {
			sorting: initialState?.sorting ?? [],
			rowHeight: rowHeightProp,
			rowSelection: initialState?.rowSelection ?? {},
			selectionState: {
				selectedCells: new Set(),
				selectionRange: null,
				isSelecting: false,
			},
			focusedCell: null,
			editingCell: null,
			contextMenu: {
				open: false,
				x: 0,
				y: 0,
			},
			searchQuery: "",
			searchMatches: [],
			matchIndex: -1,
			searchOpen: false,
			lastClickedRowIndex: null,
			isScrolling: false,
		};
	});

	const store = useMemo<DataGridStore>(() => {
		let isBatching = false;
		let pendingNotification = false;

		return {
			subscribe: (callback) => {
				listenersRef.current.add(callback);
				return () => listenersRef.current.delete(callback);
			},
			getState: () => stateRef.current,
			setState: (key, value) => {
				if (Object.is(stateRef.current[key], value)) return;
				stateRef.current[key] = value;

				if (isBatching) {
					pendingNotification = true;
				} else {
					if (!pendingNotification) {
						pendingNotification = true;
						queueMicrotask(() => {
							pendingNotification = false;
							store.notify();
						});
					}
				}
			},
			notify: () => {
				for (const listener of listenersRef.current) {
					listener();
				}
			},
			batch: (fn) => {
				if (isBatching) {
					fn();
					return;
				}

				isBatching = true;
				const wasPending = pendingNotification;
				pendingNotification = false;

				try {
					fn();
				} finally {
					isBatching = false;
					if (pendingNotification || wasPending) {
						pendingNotification = false;
						store.notify();
					}
				}
			},
		};
	}, [listenersRef, stateRef]);

	return {
		store,
		focusedCell: useStore(store, (state) => state.focusedCell),
		editingCell: useStore(store, (state) => state.editingCell),
		selectionState: useStore(store, (state) => state.selectionState),
		searchQuery: useStore(store, (state) => state.searchQuery),
		searchMatches: useStore(store, (state) => state.searchMatches),
		matchIndex: useStore(store, (state) => state.matchIndex),
		searchOpen: useStore(store, (state) => state.searchOpen),
		sorting: useStore(store, (state) => state.sorting),
		rowSelection: useStore(store, (state) => state.rowSelection),
		contextMenu: useStore(store, (state) => state.contextMenu),
		rowHeight: useStore(store, (state) => state.rowHeight),
		isScrolling: useStore(store, (state) => state.isScrolling),
	};
};
