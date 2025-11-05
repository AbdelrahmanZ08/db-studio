import { createStoreActions, useStore } from "./store";

export const activeTabStore = createStoreActions({ activeTab: "table" }, (store) => ({
	setActiveTab: (tabName: string) => {
		store.setState("activeTab", tabName);
	},
}));

export const useActiveTab = () => {
	const activeTab = useStore(activeTabStore, (state) => state.activeTab);
	const setActiveTab = activeTabStore.storeActions.setActiveTab;

	return { activeTab, setActiveTab };
};
