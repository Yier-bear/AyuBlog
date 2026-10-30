"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../siteConfig';

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';

    if (!hasSeenSplash) {
      setShow(true);
      const timer = setTimeout(() => {
        exitSplash();
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      // 容错处理：确保直接访问时类名存在
      document.documentElement.classList.add('splash-seen');
    }
  }, []);

  const exitSplash = () => {
    setShow(false);
    sessionStorage.setItem('hasSeenSplash', 'true');

    // 【核心解封】：动画快结束时，给 html 加上类名，CSS 会自动把内容显示出来
    setTimeout(() => {
      document.documentElement.classList.add('splash-seen');
    }, 500);
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash-screen-container"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden bg-[#f9ede7]"
        >
          <div className="absolute inset-0 bg-[url('/ayu-home-bg.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4d4d2]/85 via-[#fbefd9]/90 to-[#e8ecdf]/85 backdrop-blur-xl" />
          <div className="relative z-10 flex flex-col items-center rounded-[36px] border border-white/75 bg-white/35 px-12 py-10 shadow-[0_28px_80px_rgba(118,76,69,.18)] backdrop-blur-2xl">
            <div className="relative mb-7 h-28 w-28">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-[32px] bg-gradient-to-r from-[#d98a90] via-[#f1c8c4] to-[#d9c38e] opacity-70 blur-[4px]"
              />
              <div className="relative h-full w-full rounded-[30px] bg-white/80 p-1.5 shadow-xl">
                <img src={siteConfig.avatarUrl} alt="ayu 的头像" className="h-full w-full rounded-[25px] object-cover" />
              </div>
            </div>

            <h1 className="mb-2 font-serif text-2xl font-black tracking-[0.16em] text-[#493d3a]">
              ayu’s blog
            </h1>
            <p className="mb-10 font-mono text-[9px] font-bold tracking-[0.35em] text-[#a36b6f]">AI PRODUCT · NOTES · LIFE</p>

            <div className="relative h-[2px] w-44 overflow-hidden rounded-full bg-white/70">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c8787e] to-[#dfaa91] shadow-[0_0_12px_rgba(190,105,113,.5)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}