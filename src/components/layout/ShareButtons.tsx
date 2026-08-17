import { Facebook, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "bg-[#25D366] hover:bg-[#20ba59]",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      color: "bg-[#1877F2] hover:bg-[#166fe5]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <Send className="w-4 h-4" />,
      color: "bg-[#0088cc] hover:bg-[#007ab8]",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 my-8">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg ${link.color}`}
        >
          {link.icon}
          <span>Compartilhe no {link.name}</span>
        </a>
      ))}
    </div>
  );
}
