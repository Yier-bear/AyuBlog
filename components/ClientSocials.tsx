"use client";

import ContactButtons from './ContactButtons';

// 文章页作者卡片的联系方式：GitHub 跳转、邮箱/QQ/微信复制、小红书弹名片
export default function ClientSocials() {
  return <ContactButtons variant="chip" className="flex justify-center mt-4" />;
}
