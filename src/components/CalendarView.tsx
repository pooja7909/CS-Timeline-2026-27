import React, { useState } from 'react';
import { CALENDAR_EVENTS_2026_2027, CalendarEvent } from '../data/calendarEvents';
import { Calendar, ChevronLeft, ChevronRight, Info, Award, GraduationCap, Clock } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const months = [
    { name: 'August 2026', year: 2026, month: 7, days: 31, startDay: 5 }, // Aug 1 2026 is Saturday (index 5 for Mon=0)
    { name: 'September 2026', year: 2026, month: 8, days: 30, startDay: 1 }, // Sep 1 2026 is Tuesday (index 1)
    { name: 'October 2026', year: 2026, month: 9, days: 31, startDay: 3 }, // Oct 1 2026 is Thursday (index 3)
    { name: 'November 2026', year: 2026, month: 10, days: 30, startDay: 6 }, // Nov 1 2026 is Sunday (index 6)
    { name: 'December 2026', year: 2026, month: 11, days: 31, startDay: 1 }, // Dec 1 2026 is Tuesday (index 1)
    { name: 'January 2027', year: 2027, month: 0, days: 31, startDay: 4 }, // Jan 1 2027 is Friday (index 4)
    { name: 'February 2027', year: 2027, month: 1, days: 28, startDay: 0 }, // Feb 1 2027 is Monday (index 0)
    { name: 'March 2027', year: 2027, month: 2, days: 31, startDay: 0 }, // Mar 1 2027 is Monday (index 0)
    { name: 'April 2027', year: 2027, month: 3, days: 30, startDay: 3 }, // Apr 1 2027 is Thursday (index 3)
    { name: 'May 2027', year: 2027, month: 4, days: 31, startDay: 5 }, // May 1 2027 is Saturday (index 5)
    { name: 'June 2027', year: 2027, month: 5, days: 30, startDay: 1 }, // Jun 1 2027 is Tuesday (index 1)
    { name: 'July 2027', year: 2027, month: 6, days: 31, startDay: 3 } // Jul 1 2027 is Thursday (index 3)
  ];

  const getEventsForDay = (year: number, month: number, day: number): CalendarEvent[] => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return CALENDAR_EVENTS_2026_2027.filter(e => e.date === formatted);
  };

  const filteredEvents = selectedCategory === 'all'
    ? CALENDAR_EVENTS_2026_2027
    : CALENDAR_EVENTS_2026_2027.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Official Academic School Calendar 2026–2027
            </h2>
          </div>
          <p className="text-sm text-slate-600 font-mono-code font-medium">
            The British International School Budapest · Term Dates, Holidays & Assessment Milestones
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono-code font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200">
            Term Teaching Days
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-950 border border-amber-200">
            School Holidays
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-950 border border-red-200">
            Public Holidays
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-950 border border-rose-200">
            Staff Training / INSET
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-950 border border-sky-200">
            12 Noon Early Finish
          </span>
        </div>
      </div>

      {/* Term Quick Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Term 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-mono-code uppercase tracking-wider font-bold text-indigo-700">
            Term 1 · Autumn
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
            25 Aug – 16 Dec 2026
          </h3>
          <p className="text-sm text-slate-600 font-mono-code font-medium mt-0.5">
            16 Teaching Weeks
          </p>
          <div className="mt-3 text-xs text-slate-700 space-y-1.5 font-medium border-t border-slate-100 pt-3">
            <div>• 17 Aug: Staff INSET begins</div>
            <div>• 25 Aug: All students start (Tue)</div>
            <div>• 19–26 Oct: Half term holiday</div>
            <div>• 16 Dec: Term 1 ends (12 noon)</div>
          </div>
        </div>

        {/* Term 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-mono-code uppercase tracking-wider font-bold text-indigo-700">
            Term 2 · Spring
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
            6 Jan – 25 Mar 2027
          </h3>
          <p className="text-sm text-slate-600 font-mono-code font-medium mt-0.5">
            11 Teaching Weeks
          </p>
          <div className="mt-3 text-xs text-slate-700 space-y-1.5 font-medium border-t border-slate-100 pt-3">
            <div>• 4–5 Jan: Staff Training</div>
            <div>• 6 Jan: Term 2 starts (Wed)</div>
            <div>• 15–19 Feb: Half term holiday</div>
            <div>• 15 Mar: National holiday (closed)</div>
            <div>• 25 Mar: Term 2 ends (12 noon)</div>
          </div>
        </div>

        {/* Term 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-mono-code uppercase tracking-wider font-bold text-indigo-700">
            Term 3 · Summer
          </span>
          <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
            13 Apr – 24 Jun 2027
          </h3>
          <p className="text-sm text-slate-600 font-mono-code font-medium mt-0.5">
            11 Teaching Weeks
          </p>
          <div className="mt-3 text-xs text-slate-700 space-y-1.5 font-medium border-t border-slate-100 pt-3">
            <div>• 13 Apr: Term 3 starts (Tue)</div>
            <div>• 1 May: Public holiday</div>
            <div>• 17–18 May: Whitsun holiday</div>
            <div>• 24 Jun: Last day of term (12 noon)</div>
            <div>• 25 Jun: Final staff training</div>
          </div>
        </div>
      </div>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((m) => (
          <div
            key={m.name}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h4 className="font-display font-bold text-base text-slate-900">
                {m.name}
              </h4>
              <span className="text-xs font-mono-code text-slate-500 font-medium">
                {m.days} days
              </span>
            </div>

            {/* Days of week header (Mon to Sun) */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono-code text-xs text-slate-500 font-bold mb-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span className="text-slate-400">S</span>
              <span className="text-slate-400">S</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty leading padding */}
              {Array.from({ length: m.startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* Day cells */}
              {Array.from({ length: m.days }).map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(m.year, m.month, day);
                const hasEvent = events.length > 0;
                const primaryEvent = events[0];

                let cellBg = 'hover:bg-slate-100 text-slate-800 font-medium';
                if (hasEvent) {
                  if (primaryEvent.category === 'holiday') {
                    cellBg = 'bg-amber-100 text-amber-950 font-bold border border-amber-200';
                  } else if (primaryEvent.category === 'public_holiday') {
                    cellBg = 'bg-red-100 text-red-950 font-bold border border-red-200';
                  } else if (primaryEvent.category === 'training') {
                    cellBg = 'bg-rose-100 text-rose-950 font-bold border border-rose-200';
                  } else if (primaryEvent.category === 'term_start') {
                    cellBg = 'bg-emerald-100 text-emerald-950 font-bold ring-2 ring-emerald-600';
                  } else if (primaryEvent.category === 'term_end') {
                    cellBg = 'bg-sky-100 text-sky-950 font-bold ring-2 ring-sky-600';
                  }
                }

                return (
                  <div
                    key={`day-${day}`}
                    title={hasEvent ? `${events.map(e => e.title).join('; ')}` : `${m.name} ${day}`}
                    className={`h-8 rounded-lg flex flex-col items-center justify-center text-xs font-mono-code transition-colors relative group cursor-pointer ${cellBg}`}
                  >
                    <span>{day}</span>
                    {hasEvent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-0.5" />
                    )}

                    {/* Tooltip */}
                    {hasEvent && (
                      <div className="hidden group-hover:block absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-2.5 rounded-xl whitespace-nowrap z-30 shadow-xl border border-slate-700 pointer-events-none">
                        {events.map((e, idx) => (
                          <div key={idx} className="font-bold">
                            {e.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Official Events List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
          All Key Academic Dates & Deadlines (2026–2027)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CALENDAR_EVENTS_2026_2027.map((event, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3 text-xs"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono-code font-bold text-xs text-indigo-700">
                {event.date}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">
                  {event.title}
                </div>
                {event.description && (
                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
