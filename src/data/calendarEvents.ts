export interface CalendarEvent {
  date: string;
  title: string;
  category: 'term_start' | 'term_end' | 'holiday' | 'training' | 'public_holiday' | 'exam' | 'special';
  term?: 'Term 1' | 'Term 2' | 'Term 3';
  description?: string;
  colorClass: string;
}

export const CALENDAR_EVENTS_2026_2027: CalendarEvent[] = [
  // August 2026
  {
    date: '2026-08-12',
    title: 'SMT Start',
    category: 'training',
    description: 'Senior Management Team returns for planning',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2026-08-13',
    title: 'New Teachers Start (Day 1)',
    category: 'training',
    description: 'Induction for new academic staff',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2026-08-14',
    title: 'New Teachers Induction (Day 2)',
    category: 'training',
    description: 'Departmental onboarding & classroom prep',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2026-08-17',
    title: 'INSET — Returning Teachers Start',
    category: 'training',
    description: 'All returning faculty on site for professional development',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2026-08-24',
    title: 'Term Start for New Students',
    category: 'term_start',
    description: 'Orientation for new students and families',
    colorClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
  },
  {
    date: '2026-08-25',
    title: 'Term 1 Start for All Students',
    category: 'term_start',
    term: 'Term 1',
    description: 'First official teaching day of Academic Year 2026–2027',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  // October 2026
  {
    date: '2026-10-19',
    title: 'Autumn Half Term Holiday Starts',
    category: 'holiday',
    term: 'Term 1',
    description: '19–26 Oct School Holiday',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    date: '2026-10-26',
    title: 'Staff Training (No Students)',
    category: 'training',
    term: 'Term 1',
    description: 'Professional development day — students return Tue 27 Oct',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2026-10-27',
    title: 'Students Return from Half Term',
    category: 'term_start',
    term: 'Term 1',
    description: 'Teaching resumes (Week 9)',
    colorClass: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
  },
  // December 2026
  {
    date: '2026-12-16',
    title: 'Last Day of Term 1 (12 noon finish)',
    category: 'term_end',
    term: 'Term 1',
    description: 'End of Term 1 — 16 teaching weeks complete',
    colorClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
  },
  {
    date: '2026-12-17',
    title: 'Christmas & Winter Holiday Begins',
    category: 'holiday',
    description: '17 Dec 2026 – 5 Jan 2027 Winter Break',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
  },
  // January 2027
  {
    date: '2027-01-04',
    title: 'Staff Training (Day 1 — No Students)',
    category: 'training',
    description: 'Faculty INSET day',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2027-01-05',
    title: 'Staff Training (Day 2 — No Students)',
    category: 'training',
    description: 'Departmental planning & mock preparation',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    date: '2027-01-06',
    title: 'Start of Term 2 (Wed Start)',
    category: 'term_start',
    term: 'Term 2',
    description: 'Term 2 begins; Year 11 & Year 13 Mocks commence',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  // February 2027
  {
    date: '2027-02-15',
    title: 'Spring Half Term Holiday (15–19 Feb)',
    category: 'holiday',
    term: 'Term 2',
    description: 'School closed for half term break',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
  },
  // March 2027
  {
    date: '2027-03-15',
    title: '1848 National Holiday (No School)',
    category: 'public_holiday',
    term: 'Term 2',
    description: 'Hungarian National Holiday — School closed',
    colorClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
  },
  {
    date: '2027-03-25',
    title: 'Last Day of Term 2 (12 noon finish)',
    category: 'term_end',
    term: 'Term 2',
    description: 'End of Term 2 — Year 11 completes taught course',
    colorClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
  },
  {
    date: '2027-03-26',
    title: 'Spring Holiday Begins (26 Mar – 12 Apr)',
    category: 'holiday',
    description: 'Easter & Spring Vacation',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
  },
  // April 2027
  {
    date: '2027-04-13',
    title: 'Start of Term 3 (Tue Start)',
    category: 'term_start',
    term: 'Term 3',
    description: 'Term 3 commences — 11 teaching weeks',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  // May 2027
  {
    date: '2027-05-01',
    title: 'Public Holiday (Labour Day)',
    category: 'public_holiday',
    description: 'National Public Holiday',
    colorClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
  },
  {
    date: '2027-05-17',
    title: 'Whitsun Public Holiday (Day 1 — No School)',
    category: 'public_holiday',
    term: 'Term 3',
    description: 'Whitsun holiday — 3-day school week',
    colorClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
  },
  {
    date: '2027-05-18',
    title: 'Whitsun Public Holiday (Day 2 — No School)',
    category: 'public_holiday',
    term: 'Term 3',
    description: 'Whitsun holiday — students return Wed 19 May',
    colorClass: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
  },
  // June 2027
  {
    date: '2027-06-24',
    title: 'Last Day of Term 3 (12 noon finish)',
    category: 'term_end',
    term: 'Term 3',
    description: 'Final student day of 2026–2027 academic year',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    date: '2027-06-25',
    title: 'Staff Training (No Students)',
    category: 'training',
    description: 'Final faculty review, mark entries & summer handover',
    colorClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
  }
];
