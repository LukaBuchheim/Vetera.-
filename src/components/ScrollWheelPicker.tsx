import { useRef, useCallback } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const ITEM_H = 58;
const VISIBLE = 5;
const HALF = Math.floor(VISIBLE / 2);

function snap(v: number, min: number, max: number, step: number): number {
  const snapped = Math.round(v / step) * step;
  const clamped = Math.min(max, Math.max(min, snapped));
  return parseFloat(clamped.toFixed(10));
}

export default function ScrollWheelPicker({ value, onChange, min, max, step, format }: Props) {
  const dragRef = useRef<{ startY: number; lastY: number; startValue: number; velocity: number; lastTime: number } | null>(null);
  const momentumRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyMomentum = useCallback((velocity: number, currentValue: number) => {
    if (Math.abs(velocity) < 0.5) return;
    const steps = -Math.sign(velocity) * Math.ceil(Math.abs(velocity) / 8);
    const next = snap(currentValue + steps * step, min, max, step);
    onChange(next);
    momentumRef.current = setTimeout(() => {
      applyMomentum(velocity * 0.6, next);
    }, 60);
  }, [min, max, step, onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (momentumRef.current) clearTimeout(momentumRef.current);
    dragRef.current = { startY: e.clientY, lastY: e.clientY, startValue: value, velocity: 0, lastTime: Date.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const now = Date.now();
    const dy = e.clientY - dragRef.current.lastY;
    const dt = now - dragRef.current.lastTime;
    dragRef.current.velocity = dt > 0 ? dy / dt * 16 : 0;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = now;

    const totalDy = e.clientY - dragRef.current.startY;
    const steps = -Math.round(totalDy / ITEM_H);
    const next = snap(dragRef.current.startValue + steps * step, min, max, step);
    if (next !== value) onChange(next);
  };

  const onPointerUp = () => {
    if (!dragRef.current) return;
    const { velocity, startValue } = dragRef.current;
    dragRef.current = null;
    applyMomentum(velocity, value ?? startValue);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (momentumRef.current) clearTimeout(momentumRef.current);
    const steps = Math.sign(e.deltaY);
    onChange(snap(value + steps * step, min, max, step));
  };

  // Build the 5 visible items around the current value
  const centerIdx = Math.round((value - min) / step);
  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const offset = i - HALF;
    const idx = centerIdx + offset;
    const v = snap(min + idx * step, min, max, step);
    const inRange = idx >= 0 && v >= min && v <= max;
    return { offset, value: inRange ? v : null };
  });

  return (
    <div
      className="wheel-picker"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      style={{ touchAction: 'none', userSelect: 'none', cursor: 'grab' }}
    >
      <div className="wheel-fade-top" />
      <div className="wheel-fade-bottom" />
      <div className="wheel-center-band" />

      <div className="wheel-items" style={{ height: ITEM_H * VISIBLE }}>
        {items.map(item => {
          const dist = Math.abs(item.offset);
          const opacity = item.value !== null ? Math.max(0.15, 1 - dist * 0.3) : 0;
          const scale = Math.max(0.65, 1 - dist * 0.13);
          return (
            <div
              key={item.offset}
              className={`wheel-item${item.offset === 0 ? ' wheel-item-center' : ''}`}
              style={{ height: ITEM_H, opacity, transform: `scale(${scale})` }}
            >
              {item.value !== null ? format(item.value) : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
