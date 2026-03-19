import { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // Morning Menu (6:00 AM – 11:00 AM)
  {
    id: 'morning-1',
    name: 'Idly',
    price: 30,
    category: 'morning',
    isSpecial: false,
    image: '/idly.jpg'
  },
  {
    id: 'morning-2',
    name: 'Dosa',
    price: 30,
    category: 'morning',
    isSpecial: false,
    image: '/plaindosa.jpg'
  },
  {
    id: 'morning-3',
    name: 'Onion Dosa',
    price: 30,
    category: 'morning',
    isSpecial: false,
    image: '/oniondosa.jpg'
  },
  {
    id: 'morning-4',
    name: 'Karam Podi Dosa',
    price: 30,
    category: 'morning',
    isSpecial: false,
    image: '/plaindosa.jpg'
  },
  {
    id: 'morning-5',
    name: 'Punugulu',
    price: 30,
    category: 'morning',
    isSpecial: true,
    image: '/punugulu.jpg'
  },
  {
    id: 'morning-6',
    name: 'Vada',
    price: 30,
    category: 'morning',
    isSpecial: false,
    image: '/vada.jpg'
  },

  // Evening Menu (4:30 PM – 9:30 PM)
  {
    id: 'evening-1',
    name: 'Idly',
    price: 30,
    category: 'evening',
    isSpecial: false,
    image: '/idly.jpg'
  },
  {
    id: 'evening-2',
    name: 'Garelu',
    price: 30,
    category: 'evening',
    isSpecial: false,
    image: '/garelu.jpg'
  },
  {
    id: 'evening-3',
    name: 'Chitti Punugulu',
    price: 30,
    category: 'evening',
    isSpecial: false,
    image: '/punugulu.png'
  },
  {
    id: 'evening-4',
    name: 'Punugulu',
    price: 30,
    category: 'evening',
    isSpecial: true,
    image: '/punugulu.png'
  }
];

export const getCurrentMenu = (): MenuItem[] => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // For demo purposes, always show both menus with time indicators
  // In production, uncomment the time-based logic below

  // Morning: 6:00 AM (360 minutes) to 11:00 AM (660 minutes)
  if (currentTime >= 360 && currentTime < 660) {
    return menuItems.filter(item => item.category === 'morning');
  }

  // Evening: 4:30 PM (990 minutes) to 9:30 PM (1170 minutes)
  if (currentTime >= 990 && currentTime < 1170) {
    return menuItems.filter(item => item.category === 'evening');
  }

  // For demo: show all items with time indicators
  return menuItems;
};

export const isBusinessHours = (): boolean => {
  // For demo: always return true to show menu
  return true;

  // In production, uncomment the real logic:
  /*
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  return (currentTime >= 360 && currentTime < 660) || (currentTime >= 990 && currentTime < 1170);
  */
};

export const getNextOpeningTime = (): string => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  if (currentTime < 360) {
    return `Opens at 6:00 AM`;
  } else if (currentTime >= 360 && currentTime < 660) {
    return `Open until 11:00 AM`;
  } else if (currentTime >= 660 && currentTime < 990) {
    return `Opens at 4:30 PM`;
  } else if (currentTime >= 990 && currentTime < 1170) {
    return `Open until 9:30 PM`;
  } else {
    return `Opens at 6:00 AM tomorrow`;
  }
};
