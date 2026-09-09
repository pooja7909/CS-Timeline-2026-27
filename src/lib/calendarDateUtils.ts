import { TermData, ActiveWeekSetting, WeekRow, BreakRow } from '../types';

export interface CalculatedWeekInfo {
  termId: 't1' | 't2' | 't3';
  termName: string;
  fullTermName: string;
  weekN: number;
  weekText: string;
  weekKey: string;
  dates: string;
  isManual: boolean;
  isBreak?: boolean;
  breakLabel?: string;
  calendarCalculatedTerm: string;
  calendarCalculatedWeekN: number;
  calendarCalculatedDates: string;
  todayFormatted: string;
}

interface FlattenedItem {
  termId: 't1' | 't2' | 't3';
  termName: string;
  kind: 'week' | 'break';
  n?: number;
  iso?: string;
  dates: string;
  label?: string;
  row: WeekRow | BreakRow;
}

// Map of known holiday date ranges for 2026-2027
const HOLIDAY_RANGES = [
  {
    start: '2026-10-17',
    end: '2026-10-26',
    termId: 't1' as const,
    label: 'Autumn Half Term Holiday',
    upcomingWeekN: 9
  },
  {
    start: '2026-12-17',
    end: '2027-01-05',
    termId: 't2' as const,
    label: 'Christmas & Winter Holiday',
    upcomingWeekN: 1
  },
  {
    start: '2027-02-13',
    end: '2027-02-21',
    termId: 't2' as const,
    label: 'Spring Half Term Holiday',
    upcomingWeekN: 7
  },
  {
    start: '2027-03-27',
    end: '2027-04-12',
    termId: 't3' as const,
    label: 'Easter & Spring Holiday',
    upcomingWeekN: 1
  },
  {
    start: '2027-05-29',
    end: '2027-06-06',
    termId: 't3' as const,
    label: 'Whitsun / Summer Half Term Holiday',
    upcomingWeekN: 9
  }
];

export function getTodayIso(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatHumanDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Automatically determine the active school week strictly from the 2026-2027 calendar dates.
 */
export function calculateCalendarWeek(
  plan: TermData[],
  date: Date = new Date()
): {
  termId: 't1' | 't2' | 't3';
  termName: string;
  fullTermName: string;
  weekN: number;
  dates: string;
  isBreak: boolean;
  breakLabel?: string;
  weekKey: string;
} {
  const todayIso = getTodayIso(date);

  // 1. Check if today falls into any known holiday/break period
  for (const holiday of HOLIDAY_RANGES) {
    if (todayIso >= holiday.start && todayIso <= holiday.end) {
      const term = plan.find(t => t.id === holiday.termId) || plan[0];
      return {
        termId: holiday.termId,
        termName: term.name.split('·')[0].trim(),
        fullTermName: term.name,
        weekN: holiday.upcomingWeekN,
        dates: `${holiday.start.slice(5)} – ${holiday.end.slice(5)}`,
        isBreak: true,
        breakLabel: holiday.label,
        weekKey: `${holiday.termId}-${holiday.upcomingWeekN}`
      };
    }
  }

  // 2. Flatten all teaching weeks in order
  const weeks: {
    termId: 't1' | 't2' | 't3';
    termName: string;
    fullTermName: string;
    n: number;
    iso: string;
    dates: string;
  }[] = [];

  plan.forEach(term => {
    term.rows.forEach(row => {
      if (row.kind === 'week' && row.iso) {
        weeks.push({
          termId: term.id,
          termName: term.name.split('·')[0].trim(),
          fullTermName: term.name,
          n: row.n,
          iso: row.iso,
          dates: row.dates
        });
      }
    });
  });

  if (weeks.length === 0) {
    return {
      termId: 't1',
      termName: 'Term 1',
      fullTermName: 'Term 1 · Autumn',
      weekN: 1,
      dates: '25–28 Aug',
      isBreak: false,
      weekKey: 't1-1'
    };
  }

  // Before school year starts
  if (todayIso < weeks[0].iso) {
    return {
      termId: weeks[0].termId,
      termName: weeks[0].termName,
      fullTermName: weeks[0].fullTermName,
      weekN: weeks[0].n,
      dates: weeks[0].dates,
      isBreak: false,
      weekKey: `${weeks[0].termId}-${weeks[0].n}`
    };
  }

  // After school year ends
  const lastWeek = weeks[weeks.length - 1];
  if (todayIso > lastWeek.iso) {
    // Check if within 7 days after the last week start
    const lastDate = new Date(lastWeek.iso);
    lastDate.setDate(lastDate.getDate() + 7);
    const lastDateIso = getTodayIso(lastDate);
    if (todayIso <= lastDateIso) {
      return {
        termId: lastWeek.termId,
        termName: lastWeek.termName,
        fullTermName: lastWeek.fullTermName,
        weekN: lastWeek.n,
        dates: lastWeek.dates,
        isBreak: false,
        weekKey: `${lastWeek.termId}-${lastWeek.n}`
      };
    }
  }

  // Find the matching week interval
  for (let i = 0; i < weeks.length; i++) {
    const current = weeks[i];
    const next = weeks[i + 1];

    if (!next) {
      // Last week in the year
      return {
        termId: current.termId,
        termName: current.termName,
        fullTermName: current.fullTermName,
        weekN: current.n,
        dates: current.dates,
        isBreak: false,
        weekKey: `${current.termId}-${current.n}`
      };
    }

    if (todayIso >= current.iso && todayIso < next.iso) {
      return {
        termId: current.termId,
        termName: current.termName,
        fullTermName: current.fullTermName,
        weekN: current.n,
        dates: current.dates,
        isBreak: false,
        weekKey: `${current.termId}-${current.n}`
      };
    }
  }

  // Default fallback to first week
  return {
    termId: weeks[0].termId,
    termName: weeks[0].termName,
    fullTermName: weeks[0].fullTermName,
    weekN: weeks[0].n,
    dates: weeks[0].dates,
    isBreak: false,
    weekKey: `${weeks[0].termId}-${weeks[0].n}`
  };
}

/**
 * Master resolution function: returns active week info taking into account
 * whether teacher has configured automatic calendar tracking or manual override.
 */
export function getActiveSchoolWeek(
  plan: TermData[],
  setting?: ActiveWeekSetting,
  currentDate: Date = new Date()
): CalculatedWeekInfo {
  const cal = calculateCalendarWeek(plan, currentDate);
  const todayFormatted = formatHumanDate(currentDate);

  // If manual override is active
  if (setting && setting.mode === 'manual' && setting.manualTermId && setting.manualWeekN) {
    const term = plan.find(t => t.id === setting.manualTermId) || plan[0];
    const weekRow = term.rows.find(r => r.kind === 'week' && r.n === setting.manualWeekN) as WeekRow | undefined;
    const termClean = term.name.split('·')[0].trim();
    const dates = weekRow ? weekRow.dates : '';

    return {
      termId: term.id,
      termName: termClean,
      fullTermName: term.name,
      weekN: setting.manualWeekN,
      weekText: `Week ${setting.manualWeekN} (Manual Override)`,
      weekKey: `${term.id}-${setting.manualWeekN}`,
      dates,
      isManual: true,
      isBreak: false,
      calendarCalculatedTerm: cal.termName,
      calendarCalculatedWeekN: cal.weekN,
      calendarCalculatedDates: cal.dates,
      todayFormatted
    };
  }

  // Automatic calendar calculation
  const weekLabel = cal.isBreak 
    ? `${cal.breakLabel || 'School Holiday'}` 
    : `Week ${cal.weekN} (Active)`;

  return {
    termId: cal.termId,
    termName: cal.termName,
    fullTermName: cal.fullTermName,
    weekN: cal.weekN,
    weekText: weekLabel,
    weekKey: cal.weekKey,
    dates: cal.dates,
    isManual: false,
    isBreak: cal.isBreak,
    breakLabel: cal.breakLabel,
    calendarCalculatedTerm: cal.termName,
    calendarCalculatedWeekN: cal.weekN,
    calendarCalculatedDates: cal.dates,
    todayFormatted
  };
}
