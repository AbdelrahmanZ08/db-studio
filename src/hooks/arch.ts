// import React from "react";

// // Generic store interface
// interface Store<T> {
// 	subscribe: (callback: () => void) => () => void;
// 	getState: () => T;
// 	setState: <K extends keyof T>(key: K, value: T[K]) => void;
// 	notify: () => void;
// }

// // Generic store factory
// function createStore<T>(initialState: T): Store<T> {
// 	// The actual state stored in memory
// 	let state = initialState;

// 	// Set of callback functions that want to be notified when state changes
// 	// Using Set instead of array for better performance (no duplicates, fast add/remove)
// 	const listeners = new Set<() => void>();

// 	// Flag to prevent multiple notifications during batch updates
// 	let isBatching = false;

// 	return {
// 		// SUBSCRIBE: Register a callback to be called when state changes
// 		// Returns an unsubscribe function to remove the listener
// 		subscribe: (callback: () => void) => {
// 			listeners.add(callback); // Add callback to the set
// 			return () => listeners.delete(callback); // Return cleanup function
// 		},

// 		// GET STATE: Return current state snapshot
// 		getState: () => state,

// 		// SET STATE: Update a specific key in state
// 		setState: <K extends keyof T>(key: K, value: T[K]) => {
// 			state = { ...state, [key]: value }; // Create new state object (immutable)

// 			// Notify all listeners unless we're in batch mode
// 			if (!isBatching) {
// 				listeners.forEach((listener) => listener());
// 			}
// 		},

// 		// NOTIFY: Manually trigger all listeners (useful for external updates)
// 		notify: () => {
// 			listeners.forEach((listener) => listener());
// 		},

// 		// BATCH: Group multiple setState calls, notify only once at the end
// 		batch: (fn: () => void) => {
// 			isBatching = true;
// 			fn(); // Execute all setState calls
// 			isBatching = false;
// 			listeners.forEach((listener) => listener()); // Single notification
// 		},
// 	};
// }

// // Generic useStore hook
// function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
// 	// Create a stable function that gets the current selected value
// 	// This is memoized so it only changes when store or selector changes
// 	const getSnapshot = React.useCallback(() => selector(store.getState()), [store, selector]);

// 	// useSyncExternalStore does 3 things:
// 	// 1. Calls store.subscribe() to register for updates
// 	// 2. Calls getSnapshot() to get initial value
// 	// 3. Re-calls getSnapshot() whenever store notifies subscribers
// 	// 4. Re-renders component only if the selected value changed
// 	return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
// }

// // ============================================
// // VISUAL EXPLANATION
// // ============================================

// /*
// HOW IT WORKS:

// 1. STORE CREATION
//    ┌─────────────────┐
//    │  createStore()  │
//    │  state: {...}   │
//    │  listeners: []  │
//    └─────────────────┘

// 2. COMPONENT MOUNTS
//    ┌──────────────┐
//    │  Component   │  ──calls──>  useStore(store, selector)
//    └──────────────┘
//                                         │
//                                         ↓
//                                   store.subscribe(callback)
//                                         │
//                                         ↓
//                           listeners.add(callback) ✓

// 3. STATE CHANGES
//    store.setState('count', 5)
//           │
//           ↓
//    state = { ...state, count: 5 }
//           │
//           ↓
//    listeners.forEach(cb => cb())  ← NOTIFY!
//           │
//           ↓
//    Component re-renders with new value

// 4. COMPONENT UNMOUNTS
//    React calls the cleanup function
//           │
//           ↓
//    listeners.delete(callback)
//           │
//           ↓
//    Component no longer listens ✓

// REAL EXAMPLE:

// // Store has 2 listeners (2 components)
// listeners = [componentA_callback, componentB_callback]

// // When you call setState:
// store.setState('count', 10)
//   → state.count becomes 10
//   → notify() is called
//   → componentA_callback() runs → Component A re-renders
//   → componentB_callback() runs → Component B re-renders

// // When Component A unmounts:
// listeners = [componentB_callback]  ← componentA removed

// // Now setState only notifies Component B
// store.setState('count', 20)
//   → componentB_callback() runs → Only Component B re-renders
// */

// // ============================================
// // Example Usage: DataGrid
// // ============================================

// interface DataGridState {
// 	sorting: SortingState;
// 	rowHeight: RowHeightValue;
// 	rowSelection: RowSelectionState;
// 	selectionState: SelectionState;
// 	focusedCell: CellPosition | null;
// 	editingCell: CellPosition | null;
// 	contextMenu: ContextMenuState;
// 	searchQuery: string;
// 	searchMatches: CellPosition[];
// 	matchIndex: number;
// 	searchOpen: boolean;
// 	lastClickedRowIndex: number | null;
// 	isScrolling: boolean;
// }

// // Create DataGrid store
// const dataGridStore = createStore<DataGridState>({
// 	sorting: [],
// 	rowHeight: "medium",
// 	rowSelection: {},
// 	selectionState: { type: "none" },
// 	focusedCell: null,
// 	editingCell: null,
// 	contextMenu: { isOpen: false },
// 	searchQuery: "",
// 	searchMatches: [],
// 	matchIndex: 0,
// 	searchOpen: false,
// 	lastClickedRowIndex: null,
// 	isScrolling: false,
// });

// // Use in component
// function _DataGridComponent() {
// 	const searchQuery = useStore(dataGridStore, (state) => state.searchQuery);
// 	const isScrolling = useStore(dataGridStore, (state) => state.isScrolling);

// 	const _handleSearch = (query: string) => {
// 		dataGridStore.setState("searchQuery", query);
// 	};

// 	return (
//     <div>
//       <input value={searchQuery}
// 	onChange={(_e) => handleSearch(e.target.value)} />
//       {isScrolling && <div>Scrolling...</div>}
//     </div>
// 	)
// }

// // ============================================
// // PRACTICAL EXAMPLE: See Subscribe/Notify in Action
// // ============================================

// interface CounterState {
// 	count: number;
// 	step: number;
// 	history: number[];
// }

// const counterStore = createStore<CounterState>({
// 	count: 0,
// 	step: 1,
// 	history: [],
// });

// // You can also subscribe manually outside React:
// const _unsubscribe = counterStore.subscribe(() => {
// 	console.log("State changed!", counterStore.getState());
// });

// // When you call setState, all subscribers are notified:
// counterStore.setState("count", 5);
// // → Console: "State changed! { count: 5, step: 1, history: [] }"

// // Later, stop listening:
// // unsubscribe();

// function _CounterComponent() {
// 	// This component automatically subscribes when it mounts
// 	// and unsubscribes when it unmounts
// 	const count = useStore(counterStore, (state) => state.count);
// 	const step = useStore(counterStore, (state) => state.step);

// 	const _increment = () => {
// 		// Without batch: notifies listeners 2 times (2 re-renders)
// 		// counterStore.setState('count', counterStore.getState().count + step);
// 		// counterStore.setState('history', [...counterStore.getState().history, count]);

// 		// With batch: notifies listeners only 1 time (1 re-render)
// 		counterStore.batch(() => {
// 			counterStore.setState("count", counterStore.getState().count + step);
// 			counterStore.setState("history", [...counterStore.getState().history, count]);
// 		});
// 	};

// 	const _manualNotify = () => {
// 		// Sometimes you modify state outside the store and need to manually notify
// 		// (This is rare - usually setState does it automatically)
// 		counterStore.notify();
// 	};

// 	return (
//     <div>
//       <p>Count
// 	: count</p>
//       <button onClick=
// 		_increment
// 	>Increment by step</button>
//       <button onClick=
// 		_manualNotify
// 	>Manual Notify</button>
//     </div>
//   )
// }

// // ============================================
// // Advanced: Store with Actions
// // ============================================

// function createStoreWithActions<T, A extends Record<string, (...args: any[]) => void>>(
// 	initialState: T,
// 	actions: (store: Store<T>) => A,
// ) {
// 	const store = createStore(initialState);
// 	const boundActions = actions(store);

// 	return {
// 		...store,
// 		actions: boundActions,
// 	};
// }

// // Example with actions
// interface TodoState {
// 	todos: Array<{ id: number; text: string; done: boolean }>;
// 	filter: "all" | "active" | "completed";
// }

// const _todoStore = createStoreWithActions<
// 	TodoState,
// 	{
// 		addTodo: (text: string) => void;
// 		toggleTodo: (id: number) => void;
// 		setFilter: (filter: TodoState["filter"]) => void;
// 	}
// >(
// 	{
// 		todos: [],
// 		filter: "all",
// 	},
// 	(store) => ({
// 		addTodo: (text: string) => {
// 			const todos = store.getState().todos;
// 			store.setState("todos", [...todos, { id: Date.now(), text, done: false }]);
// 		},
// 		toggleTodo: (id: number) => {
// 			const todos = store.getState().todos;
// 			store.setState(
// 				"todos",
// 				todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
// 			);
// 		},
// 		setFilter: (filter: TodoState["filter"]) => {
// 			store.setState("filter", filter);
// 		},
// 	}),
// );

// // function TodoComponent() {
// //   const todos = useStore(todoStore, (state) => state.todos);
// //   const filter = useStore(todoStore, (state) => state.filter);

// //   return (
// //     <div>
// //       <button onClick={() => todoStore.actions.addTodo('New task')}>Add Todo</button>
// //       <button onClick={() => todoStore.actions.setFilter('all')}>All</button>
// //       {todos.map((todo) => (
// //         <div key={todo.id} onClick={() => todoStore.actions.toggleTodo(todo.id)}>
// //           {todo.text} - {todo.done ? '✓' : '○'}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
