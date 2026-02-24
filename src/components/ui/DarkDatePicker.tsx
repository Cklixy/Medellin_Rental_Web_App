import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DarkDatePickerProps {
  label: string;
  value: string;           // ISO date string "YYYY-MM-DD"
  onChange: (iso: string) => void;
  minDate?: string;        // ISO date string
  maxDate?: string;
  allowedDates?: string[]; // Only these ISO dates are selectable
  defaultMonth?: string;   // ISO date to start calendar view on
}

function parseISO(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function DarkDatePicker({ label, value, onChange, minDate, maxDate, allowedDates, defaultMonth }: DarkDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(parseISO(value) ?? parseISO(defaultMonth) ?? new Date());
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number; above: boolean }>({ top: 0, left: 0, width: 280, above: false });
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selected = parseISO(value);
  const minD = parseISO(minDate);
  const maxD = parseISO(maxDate);

  // When allowedDates changes and current value is not in it, keep it (parent handles reset)
  const allowedSet = allowedDates ? new Set(allowedDates) : null;

  // Close on outside click (must check both the trigger wrapper AND the portal calendar)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideTrigger = ref.current?.contains(target);
      const insideCalendar = calendarRef.current?.contains(target);
      if (!insideTrigger && !insideCalendar) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Recalculate position on open or scroll/resize
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const calc = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const calH = 320; // approx calendar height
      const calW = 290;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;
      const above = spaceBelow < calH && rect.top > calH;
      const left = spaceRight < calW ? Math.max(4, rect.right - calW) : rect.left;
      setDropPos({
        top: above ? rect.top - calH - 4 : rect.bottom + 4,
        left,
        width: rect.width,
        above,
      });
    };
    calc();
    window.addEventListener('scroll', calc, true);
    window.addEventListener('resize', calc);
    return () => {
      window.removeEventListener('scroll', calc, true);
      window.removeEventListener('resize', calc);
    };
  }, [open]);

  const formatted = selected
    ? selected.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <div ref={ref} className="relative">
      <label className="block text-white/70 text-sm mb-2">
        <CalendarIcon className="w-4 h-4 inline mr-2" />
        {label}
      </label>

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between bg-white/5 border rounded-xl px-4 py-3 text-left transition-colors focus:outline-none ${
          open ? 'border-red-500/60' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className={formatted ? 'text-white' : 'text-white/30'}>
          {formatted ?? 'dd/mm/aaaa'}
        </span>
        <CalendarIcon className="w-4 h-4 text-white/40 flex-shrink-0" />
      </button>

      {/* Dropdown calendar — rendered in a portal so it's never clipped by overflow:hidden */}
      {open && createPortal(
        <div
          ref={calendarRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            minWidth: 290,
            zIndex: 9999,
          }}
          className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-4"
        >
          <DayPicker
            mode="single"
            selected={selected}
            month={month}
            onMonthChange={setMonth}
            locale={es}
            disabled={[
              ...(minD ? [{ before: minD }] : []),
              ...(maxD ? [{ after: maxD }] : []),
              ...(allowedSet ? [(d: Date) => !allowedSet.has(toISO(d))] : []),
            ]}
            onSelect={(day) => {
              if (day) {
                onChange(toISO(day));
                setOpen(false);
              }
            }}
            classNames={{
              root: 'w-full',
              months: 'w-full',
              month: 'w-full',
              month_caption: 'flex items-center justify-center mb-3 relative h-8',
              caption_label: 'text-white font-semibold text-sm capitalize',
              nav: 'flex items-center justify-between absolute inset-x-0 top-0',
              button_previous:
                'flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors',
              button_next:
                'flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors',
              weekdays: 'grid grid-cols-7 mb-1',
              weekday: 'text-center text-white/30 text-xs font-medium py-1 uppercase',
              weeks: 'w-full',
              week: 'grid grid-cols-7',
              day: 'flex items-center justify-center p-0',
              day_button:
                'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none',
              selected:
                '!bg-red-600 !text-white rounded-xl font-bold shadow-lg shadow-red-900/40',
              today: 'text-red-400 font-bold',
              outside: 'text-white/20',
              disabled: 'text-white/15 cursor-not-allowed',
              hidden: 'invisible',
            }}
            components={{
              Chevron: ({ orientation }) =>
                orientation === 'left'
                  ? <ChevronLeft className="w-4 h-4" />
                  : <ChevronRight className="w-4 h-4" />,
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
