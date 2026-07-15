import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number | '';
  onChange: (value: string | number | '') => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = 'Seleccionar...', disabled = false }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      const updatePosition = () => {
        if (wrapperRef.current) {
          setRect(wrapperRef.current.getBoundingClientRect());
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => {
          if (disabled) return;
          if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect());
          setIsOpen(true);
        }}
        className={`w-full text-base p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between font-medium transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text focus-within:border-indigo-500 focus-within:bg-white'}`}
      >
        <input
          type="text"
          className="w-full bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-500"
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : '')}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect());
            setIsOpen(true);
            setSearchTerm('');
          }}
          disabled={disabled}
        />
        <ChevronDown 
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            setIsOpen(!isOpen);
          }}
          className={`w-4 h-4 text-slate-400 transition-transform cursor-pointer ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {isOpen && rect && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-slate-200 rounded shadow-lg overflow-hidden flex flex-col font-medium"
          style={{
            top: `${rect.bottom + 4}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            maxHeight: '240px'
          }}
        >
          <div className="overflow-y-auto p-1 custom-scrollbar">

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 text-base cursor-pointer transition-colors ${
                    option.disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:bg-indigo-50 hover:text-indigo-700'
                  } ${
                    option.value === value ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700'
                  }`}
                  onClick={() => {
                    if (option.disabled) return;
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="p-3 text-base text-center text-slate-500">
                No hay resultados
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
