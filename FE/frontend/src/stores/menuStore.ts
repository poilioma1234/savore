import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MenuItem {
  key: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface MenuState {
  menuItems: MenuItem[];
  selectedKeys: string[];
  openKeys: string[];
  setMenuItems: (items: MenuItem[]) => void;
  setSelectedKeys: (keys: string[]) => void;
  setOpenKeys: (keys: string[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (key: string, item: MenuItem) => void;
  removeMenuItem: (key: string) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      // State
      menuItems: [],
      selectedKeys: [],
      openKeys: [],

      // Actions
      setMenuItems: (items) => set({ menuItems: items }),
      setSelectedKeys: (keys) => set({ selectedKeys: keys }),
      setOpenKeys: (keys) => set({ openKeys: keys }),
      
      addMenuItem: (item) => {
        const { menuItems } = get();
        set({ menuItems: [...menuItems, item] });
      },
      
      updateMenuItem: (key, updatedItem) => {
        const { menuItems } = get();
        const updatedItems = menuItems.map(item => 
          item.key === key ? { ...item, ...updatedItem } : item
        );
        set({ menuItems: updatedItems });
      },
      
      removeMenuItem: (key) => {
        const { menuItems } = get();
        const filteredItems = menuItems.filter(item => item.key !== key);
        set({ menuItems: filteredItems });
      },
    }),
    {
      name: "menu-storage",
      partialize: (state) => ({
        menuItems: state.menuItems,
        selectedKeys: state.selectedKeys,
        openKeys: state.openKeys,
      }),
    },
  ),
);
export default useMenuStore;

