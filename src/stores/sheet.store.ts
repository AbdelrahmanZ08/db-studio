import { create } from "zustand";

export type SheetName = "add-table" | "add-row";

type SheetState = {
	activeSheet: SheetName | null;
	openSheet: (sheetName: SheetName) => void;
	closeSheet: () => void;
	toggleSheet: (sheetName: SheetName) => void;
	isSheetOpen: (sheetName: SheetName) => boolean;
};

export const useSheetStore = create<SheetState>()((set, get) => ({
	activeSheet: null,
	openSheet: (sheetName: SheetName) => set({ activeSheet: sheetName }),
	closeSheet: () => set({ activeSheet: null }),
	toggleSheet: (sheetName: SheetName) =>
		set((state) => ({
			activeSheet: state.activeSheet === sheetName ? null : sheetName,
		})),
	isSheetOpen: (sheetName: SheetName) => get().activeSheet === sheetName,
}));
