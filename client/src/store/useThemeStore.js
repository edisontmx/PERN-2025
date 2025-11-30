import { create } from "zustand"

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("default-theme") || "luxury",
    setTheme: (theme) => {
        localStorage.setItem("default-theme", theme);
        set({theme})
    },
}))