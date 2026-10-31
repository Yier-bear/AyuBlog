"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 默认使用与当前博客视觉一致的暖色亮色主题
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 标记组件已挂载，避免 hydration 报错
    setMounted(true);

    // 新版首次加载时清除旧页面遗留的深色状态，恢复暖色亮色外观
    const themeVersion = localStorage.getItem('ayu-theme-version');
    const isFirstAyuThemeLoad = themeVersion !== 'light-default-v1';
    const savedTheme = localStorage.getItem('blog-theme');
    const isDarkMode = !isFirstAyuThemeLoad && savedTheme === 'dark';
    if (isFirstAyuThemeLoad) {
      localStorage.setItem('blog-theme', 'light');
      localStorage.setItem('ayu-theme-version', 'light-default-v1');
    }
    setIsDark(isDarkMode);

    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // 极其重要：监听 isDark 状态，只要它变了，立刻强制更新 html 标签，防止路由切换丢失
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('blog-theme', newDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);