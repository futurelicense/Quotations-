import React, { useEffect, useState, useRef } from 'react';
import { MoreVerticalIcon } from 'lucide-react';
interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}
interface DropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
}
export function Dropdown({
  items,
  trigger
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        {trigger || <MoreVerticalIcon className="w-4 h-4 text-gray-600" />}
      </button>

      {isOpen && <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {items.map((item, index) => <button key={index} onClick={() => {
        item.onClick();
        setIsOpen(false);
      }} className={`
                w-full px-4 py-2 text-left text-sm flex items-center gap-2
                transition-colors
                ${item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}
              `}>
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>)}
        </div>}
    </div>;
}