'use client';

import { Card } from '@jamsr-ui/react';
import { useTheme } from '@/context/ThemeContext';
import { Eye, Info, Trending } from './svgs';

const titles = [
    { text: ' Trending item - 71 sold in the last day', icon: <Trending  /> },
    { text: 'Popular - 25 people are looking at this now ', icon: <Info  /> },
    { text: 'Model is 6 0 tall and is wearing size 10', icon: <Eye  /> },
  ];


// Éco-conception : suppression du carrousel auto-rotatif (setInterval permanent
// + animation continue). L'information est désormais affichée statiquement,
// sans timer JS ni re-render perpétuel côté client.
export default function TitleCarousel() {
  const { theme } = useTheme();

  return (
    <Card className={`flex flex-col border-none gap-2 text-neutral-500 text-sm tracking-tight p-4 rounded-lg w-full ${theme === "light" ? "bg-neutral-100" : "bg-neutral-800"}`}>
      {titles.map((item) => (
        <div key={item.text} className="flex items-center gap-2">
          {item.icon} {item.text}
        </div>
      ))}
    </Card>
  );
}
