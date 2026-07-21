import React, { useId, useRef, useState, useCallback, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - gap;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + gap;
        break;
      case 'left':
        x = rect.left - gap;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + gap;
        y = rect.top + rect.height / 2;
        break;
    }

    setCoords({ x, y });
  }, [position]);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const show = () => { updatePosition(); el.setAttribute('data-tooltip', 'true'); };
    const hide = () => { setCoords(null); el.removeAttribute('data-tooltip'); };

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', show);
    el.addEventListener('blur', hide);

    return () => {
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hide);
      el.removeEventListener('focus', show);
      el.removeEventListener('blur', hide);
    };
  }, [updatePosition]);

  const isTop = position === 'top';
  const isBottom = position === 'bottom';
  const isLeft = position === 'left';
  const isRight = position === 'right';

  return (
    <>
      <div ref={triggerRef} className="inline-flex" aria-describedby={tooltipId}>
        {children}
      </div>
      {coords && (
        <div
          id={tooltipId}
          role="tooltip"
          className="fixed z-[9999] px-3 py-2 text-xs font-medium text-white bg-slate-800 rounded-lg shadow-lg max-w-64 whitespace-normal leading-relaxed pointer-events-none"
          style={{
            left: coords.x,
            top: coords.y,
            transform: isTop
              ? 'translate(-50%, -100%)'
              : isBottom
                ? 'translate(-50%, 0)'
                : isLeft
                  ? 'translate(-100%, -50%)'
                  : 'translate(0, -50%)',
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}
