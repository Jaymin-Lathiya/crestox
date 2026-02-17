import React from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

export default function Navigation() {
  const { currentView, setCurrentView, setIsExploded } = useAppStore();

  const navItems = [
    { id: 'home', label: 'FEATURED' },
    { id: 'marketplace', label: 'GALAXY' },
    { id: 'vault', label: 'VAULT' },
  ] as const;

  const handleNavClick = (view: typeof navItems[number]['id']) => {
    setCurrentView(view);
    setIsExploded(false);
  };

  return (
    <nav className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={currentView === item.id ? 'default' : 'void'}
          size="sm"
          onClick={() => handleNavClick(item.id)}
          className="justify-start"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}
