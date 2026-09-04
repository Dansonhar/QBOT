import { Calendar, Rocket, Sparkles } from 'lucide-react';
import {
  PROJECT_TIMELINE, TIMELINE_TOTAL_WEEKS,
  snapToNextMonday, weekStartDate, computeLaunchDate, toISODate, fromISODate,
} from '../data/quoteStudioCatalog';

const LIME = '#CCFF00';

const shortDate = (d: Date) =>
  d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short' });
const longDate = (d: Date) =>
  d.toLocaleDateString('en-MY', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

interface Props {
  startDateISO?: string | null;                    // YYYY-MM-DD (when known)
  onStartDateChange?: (iso: string) => void;       // when set, renders the picker
}

export default function QuoteStudioTimeline({ startDateISO, onStartDateChange }: Props) {
  const weeks = Array.from({ length: TIMELINE_TOTAL_WEEKS }, (_, i) => i + 1);

  // Snap any user-picked date forward to the upcoming Monday so launch always lands on Monday.
  const startMonday = startDateISO ? snapToNextMonday(fromISODate(startDateISO)) : null;
  const launch = startMonday ? computeLaunchDate(startMonday) : null;

  // Today as the earliest pickable date (no past kick-offs).
  const todayISO = toISODate(new Date());

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Calendar size={14} strokeWidth={2.5} className="flex-shrink-0" />
        <h3 className="font-black uppercase tracking-tight text-[14px]">Your 8-Week Rollout Plan</h3>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">Confirmation → Launch</span>
      </div>

      {/* Date picker (interactive mode) */}
      {onStartDateChange && (
        <div className="border-2 border-black p-3 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'rgba(204,255,0,0.08)' }}>
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-black flex-shrink-0">
            Kick-off Date
          </label>
          <input
            type="date"
            value={startDateISO ?? ''}
            min={todayISO}
            onChange={e => onStartDateChange(e.target.value)}
            className="border-2 border-black bg-white px-3 py-1.5 text-[13px] font-bold focus:outline-none"
          />
          {startMonday && (
            <span className="text-[10px] text-gray-700 font-mono">
              W1 starts <strong>{shortDate(startMonday)}</strong>
              {startDateISO && toISODate(startMonday) !== startDateISO && (
                <> · snapped to the next Monday</>
              )}
            </span>
          )}
        </div>
      )}

      {/* Read-only mode but no date set → minimal note */}
      {!onStartDateChange && !startMonday && (
        <p className="text-[11px] text-gray-500 italic">Kick-off date not yet selected.</p>
      )}

      {/* Desktop / print: Gantt grid */}
      <div className="hidden sm:block border-2 border-black bg-white overflow-hidden">
        <div className="grid bg-black text-white" style={{ gridTemplateColumns: `180px repeat(${TIMELINE_TOTAL_WEEKS}, 1fr)` }}>
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider">Phase</div>
          {weeks.map(w => {
            const wd = startMonday ? weekStartDate(startMonday, w) : null;
            return (
              <div key={w} className="px-1 py-2 text-center border-l border-white/20">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider">W{w}</div>
                {wd && <div className="text-[9px] font-mono text-white/70 mt-0.5">{shortDate(wd)}</div>}
              </div>
            );
          })}
        </div>
        {PROJECT_TIMELINE.map(phase => (
          <div
            key={phase.id}
            className="grid border-t border-gray-200"
            style={{ gridTemplateColumns: `180px repeat(${TIMELINE_TOTAL_WEEKS}, 1fr)` }}
          >
            <div className="px-3 py-2 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                {phase.highlight && (
                  <Sparkles size={11} strokeWidth={3} style={{ color: '#1f6b00' }} />
                )}
                <span className="text-[11px] font-black text-black leading-tight">{phase.title}</span>
              </div>
              {phase.note && <span className="text-[9px] font-mono text-gray-500 mt-0.5">{phase.note}</span>}
            </div>
            {weeks.map(w => {
              const active = w >= phase.startWeek && w <= phase.endWeek;
              const isStart = w === phase.startWeek && active;
              const isEnd = w === phase.endWeek && active;
              return (
                <div key={w} className="border-l border-gray-200 relative h-9 flex items-center">
                  {active && (
                    <div
                      className="absolute inset-y-2"
                      style={{
                        left: isStart ? '4px' : '0',
                        right: isEnd ? '4px' : '0',
                        backgroundColor: phase.highlight ? '#000' : LIME,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile: stacked list */}
      <div className="sm:hidden border-2 border-black bg-white divide-y divide-gray-200">
        {PROJECT_TIMELINE.map(phase => {
          const range = phase.startWeek === phase.endWeek
            ? `W${phase.startWeek}`
            : `W${phase.startWeek}–W${phase.endWeek}`;
          const dateLabel = startMonday
            ? phase.startWeek === phase.endWeek
              ? shortDate(weekStartDate(startMonday, phase.startWeek))
              : `${shortDate(weekStartDate(startMonday, phase.startWeek))} – ${shortDate(weekStartDate(startMonday, phase.endWeek))}`
            : null;
          return (
            <div key={phase.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                {phase.highlight && (
                  <Sparkles size={12} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: '#1f6b00' }} />
                )}
                <div className="min-w-0">
                  <div className="text-[12px] font-black text-black leading-tight">{phase.title}</div>
                  {phase.note && <div className="text-[10px] text-gray-500 mt-0.5">{phase.note}</div>}
                  {dateLabel && <div className="text-[10px] font-mono text-gray-600 mt-0.5">{dateLabel}</div>}
                </div>
              </div>
              <div
                className={`flex-shrink-0 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-1 ${phase.highlight ? 'bg-black text-white' : 'text-black'}`}
                style={!phase.highlight ? { backgroundColor: LIME } : undefined}
              >
                {range}
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch milestone (W9 Monday) */}
      <div className="border-2 border-black p-4 flex items-center justify-between gap-3 flex-wrap" style={{ backgroundColor: launch ? LIME : '#f5f5f5' }}>
        <div className="flex items-center gap-2">
          <Rocket size={16} strokeWidth={3} className="text-black flex-shrink-0" />
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/70">Launch · W9 Monday</div>
            <div className="text-[16px] font-black uppercase text-black leading-tight">
              {launch ? longDate(launch) : 'Pick a kick-off date to lock in launch day'}
            </div>
          </div>
        </div>
        {launch && (
          <div className="text-[10px] font-mono uppercase tracking-wider text-black/70">Estimated Go-Live</div>
        )}
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed">
        * Timeline is indicative. Actual dates may shift based on hardware lead time, payment gateway approval, and your team's availability.
      </p>
    </div>
  );
}
