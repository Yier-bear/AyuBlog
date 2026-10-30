import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { siteConfig } from "../../siteConfig";
import MessageWall from "./MessageWall";

export const metadata = {
  title: `留言墙 | ${siteConfig.title}`,
  description: "留下你的足迹，每一张便签都是一份温暖。",
};

export default function MessagesPage() {
  return <div className="ayu-site min-h-screen"><Navbar /><PageTransition><MessageWall /></PageTransition></div>;
}
