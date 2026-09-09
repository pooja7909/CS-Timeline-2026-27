import { TermData, YearConfig } from '../types';

export const YEARS: YearConfig[] = [
  {
    id: 'y7',
    label: 'Year 7',
    short: 'Y7',
    stage: 'ks3',
    qualification: 'Key Stage 3 Computing',
    color: '#64748b', // Subtle Slate
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    badgeBorder: 'border-slate-300 dark:border-slate-700'
  },
  {
    id: 'y8',
    label: 'Year 8',
    short: 'Y8',
    stage: 'ks3',
    qualification: 'Key Stage 3 Computing',
    color: '#0284c7', // Subtle Sky-Steel
    badgeBg: 'bg-sky-50/80 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
    badgeBorder: 'border-sky-200/80 dark:border-sky-800/60'
  },
  {
    id: 'y9',
    label: 'Year 9',
    short: 'Y9',
    stage: 'ks3',
    qualification: 'Key Stage 3 Computing',
    color: '#059669', // Subtle Sage Green
    badgeBg: 'bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200/80 dark:border-emerald-800/60'
  },
  {
    id: 'y10',
    label: 'Year 10',
    short: 'Y10',
    stage: 'ks4',
    qualification: 'Edexcel IGCSE (4CP0) Yr 1',
    color: '#b45309', // Subtle Warm Bronze
    badgeBg: 'bg-amber-50/80 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    badgeBorder: 'border-amber-200/80 dark:border-amber-800/60'
  },
  {
    id: 'y11',
    label: 'Year 11',
    short: 'Y11',
    stage: 'ks4',
    qualification: 'Edexcel IGCSE (4CP0) Exam Year',
    color: '#be123c', // Subtle Crimson-Rose
    badgeBg: 'bg-rose-50/80 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
    badgeBorder: 'border-rose-200/80 dark:border-rose-800/60'
  },
  {
    id: 'y12',
    label: 'Year 12',
    short: 'Y12',
    stage: 'ks5',
    qualification: 'IB DP Comp Sci (Exam 2028)',
    color: '#6366f1', // Subtle Iris
    badgeBg: 'bg-indigo-50/80 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200/80 dark:border-indigo-800/60'
  },
  {
    id: 'y13',
    label: 'Year 13',
    short: 'Y13',
    stage: 'ks5',
    qualification: 'IB DP Comp Sci (Exam May 2027)',
    color: '#4338ca', // Deep Slate Indigo
    badgeBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    badgeBorder: 'border-slate-300 dark:border-slate-700'
  }
];

export const INITIAL_PLAN: TermData[] = [
  {
    id: 't1',
    name: 'Term 1 · Autumn',
    dates: '25 Aug – 16 Dec 2026',
    weeks: 16,
    themeColor: '#475569',
    rows: [
      {
        kind: 'week',
        n: 1,
        dates: '25–28 Aug',
        iso: '2026-08-25',
        flag: 'Tue start · New Term',
        note: 'Welcome new students, distribute network logins, firefly credentials, and baseline diagnostic tasks.',
        cells: {
          y7: { text: 'Digital Literacy 1 — logins, Firefly, e-safety routines', assess: false, taught: false },
          y8: { text: 'Digital Literacy 1 — routines, cloud files, e-safety refresh', assess: false, taught: false },
          y9: { text: 'Python 1 — IDE setup, Code Avengers, print & input functions', assess: false, taught: false },
          y10: { text: '3.1.1 — Why computers use binary: numbers, text, sound, graphics', assess: false, taught: false },
          y11: { text: 'Python recap — data types, input/output, arithmetic operators', assess: false, taught: false },
          y12: { text: 'Course intro; B1.1 — approaches to computational thinking & abstraction', assess: false, taught: false },
          y13: { text: 'IA — review summer progress, agree criteria scope & completion roadmap', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 2,
        dates: '31 Aug – 4 Sep',
        iso: '2026-08-31',
        note: 'Check all students have verified Google Classroom / Firefly course enrolments.',
        cells: {
          y7: { text: 'Digital Literacy 2 — folder management, document editing, email etiquette', assess: false, taught: false },
          y8: { text: 'Digital Literacy 2 — spreadsheets, formulas & presenting data', assess: false, taught: false },
          y9: { text: 'Python 2 — variables, naming rules and fundamental data types', assess: false, taught: false },
          y10: { text: '3.1.3 — Converting between binary and denary (0–255)', assess: false, taught: false },
          y11: { text: 'Python recap — selection, relational operators and Boolean logic', assess: false, taught: false },
          y12: { text: 'B2.1 pt 1 — variables, dynamic typing, arithmetic operators (Python)', assess: false, taught: false },
          y13: { text: 'IA — Development Sprint 1: client consultation and UI prototype', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 3,
        dates: '7–11 Sep',
        iso: '2026-09-07',
        note: 'Introduce Scratch blocks / Python syntax troubleshooting guides.',
        cells: {
          y7: { text: 'Digital Literacy 3 — efficient search, evaluating sources, consolidation', assess: false, taught: false },
          y8: { text: 'Scratch 1 — interface overview, sprites, Cartesian coordinates, motion', assess: false, taught: false },
          y9: { text: 'Python 3 — arithmetic operations, modulus, integer division & casting', assess: false, taught: false },
          y10: { text: '3.1.2 — Unsigned and signed integers; sign and magnitude representation', assess: false, taught: false },
          y11: { text: 'Python recap — iteration: while, for, nested loops', assess: false, taught: false },
          y12: { text: 'B2.3 — Programming constructs: selection and branching logic', assess: false, taught: false },
          y13: { text: 'IA — Development Sprint 2: data structures and persistence logic', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 4,
        dates: '14–18 Sep',
        iso: '2026-09-14',
        note: 'Y10 Two’s complement practice worksheets.',
        cells: {
          y7: { text: 'Kodu 1 — 3D world building, terrain editing and controls', assess: false, taught: false },
          y8: { text: 'Scratch 2 — event handlers, user input & sequencing', assess: false, taught: false },
          y9: { text: 'Python 4 — selection constructs: if, elif, else statements', assess: false, taught: false },
          y10: { text: '3.1.2 — Two’s complement negative binary representation & ranges', assess: false, taught: false },
          y11: { text: 'Python recap — 1D and 2D arrays, records and dictionary structures', assess: false, taught: false },
          y12: { text: 'B2.3 — Iteration: while loops, for loops and sentinels', assess: false, taught: false },
          y13: { text: 'A3.4 — Alternative databases, NoSQL, distributed data warehouses', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 5,
        dates: '21–25 Sep',
        iso: '2026-09-21',
        note: 'Mid-term check on coursework milestones.',
        cells: {
          y7: { text: 'Kodu 2 — WHEN / DO programming rules, object interactions', assess: false, taught: false },
          y8: { text: 'Scratch 3 — loops, repeat until, iteration patterns', assess: false, taught: false },
          y9: { text: 'Python 5 — nested conditionals and compound Boolean expressions (and/or/not)', assess: false, taught: false },
          y10: { text: '3.1.4 — Binary addition and the concept of arithmetic overflow', assess: false, taught: false },
          y11: { text: 'Python recap — subprograms, parameters, local vs global variable scope', assess: false, taught: false },
          y12: { text: 'B2.3 — Subprograms, modular decomposition and functions', assess: false, taught: false },
          y13: { text: 'A2.1 — Network fundamentals: LAN/WAN/SAN, topologies, OSI reference model', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 6,
        dates: '28 Sep – 2 Oct',
        iso: '2026-09-28',
        note: 'Y12/13 algorithm performance comparisons.',
        cells: {
          y7: { text: 'Kodu 3 — scoring variables, health meters, win/loss state conditions', assess: false, taught: false },
          y8: { text: 'Scratch 4 — variables, scoreboards, timer countdowns', assess: false, taught: false },
          y9: { text: 'Python 6 — condition-controlled while loops and loop counters', assess: false, taught: false },
          y10: { text: '3.1.4 — Logical and arithmetic bit shifts (left/right multiplication/division)', assess: false, taught: false },
          y11: { text: 'Python recap — string slicing, sanitisation, reading/writing text files', assess: false, taught: false },
          y12: { text: 'B2.1 pt 2 — parameter passing by value/reference, return types, exceptions', assess: false, taught: false },
          y13: { text: 'A2.2 — Network architecture, packet switching, TCP/IP 4-layer suite', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 7,
        dates: '5–9 Oct',
        iso: '2026-10-05',
        note: 'Y7 Kodu pre-assessment polish; Y11 Paper 2 practical timed prep.',
        cells: {
          y7: { text: 'Kodu 4 — character navigation paths, sound effects, level polish', assess: false, taught: false },
          y8: { text: 'Scratch 5 — nested conditionals, collision sensing and message broadcasting', assess: false, taught: false },
          y9: { text: 'Python 7 — count-controlled for loops and range() steps', assess: false, taught: false },
          y10: { text: '3.1.5 — Hexadecimal representation: hex ↔ binary ↔ denary conversions', assess: false, taught: false },
          y11: { text: 'Paper 2 practice — timed practical problem-solving in Python IDE', assess: false, taught: false },
          y12: { text: 'B2.2 — Data structures: arrays, 1D collections and traversal algorithms', assess: false, taught: false },
          y13: { text: 'A2.3 — Data transmission: bandwidth, latency, jitter, error detection (CRC)', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 8,
        dates: '12–16 Oct',
        iso: '2026-10-12',
        flag: 'Assessments',
        note: 'Y7 Assessment + Y11 Paper 2 Mock Style Test before Half Term.',
        cells: {
          y7: { text: 'Kodu Assessment — game mechanics, scoring & problem solving', assess: true, taught: false },
          y8: { text: 'Scratch 6 — revision, debugging challenges and practice scenarios', assess: false, taught: false },
          y9: { text: 'Python 8 — consolidation challenges, trace tables & syntax review', assess: false, taught: false },
          y10: { text: 'Topic 3.1 consolidation — exam-style calculation paper & peer grading', assess: false, taught: false },
          y11: { text: 'Programming assessment — Paper 2 timed practical examination', assess: true, taught: false },
          y12: { text: 'B2.2 — 2D arrays, matrix indexing, lookup tables and dictionaries', assess: false, taught: false },
          y13: { text: 'A2.4 — Network security: TLS/SSL, symmetric vs asymmetric encryption, auth', assess: false, taught: false }
        }
      },
      {
        kind: 'break',
        label: 'Autumn Half Term Holiday · 19–26 Oct',
        detail: '26 Oct: Staff Training (no students). Students return Tuesday 27 Oct.'
      },
      {
        kind: 'week',
        n: 9,
        dates: '27–30 Oct',
        iso: '2026-10-27',
        flag: 'Tue start',
        note: 'Feedback on first assessments.',
        cells: {
          y7: { text: 'Assessment feedback + project design brief launch', assess: false, taught: false },
          y8: { text: 'Scratch Assessment — game logic, variables and interactive mechanics', assess: true, taught: false },
          y9: { text: 'Python 9 — lists, indexing, append/pop methods and iterations', assess: false, taught: false },
          y10: { text: '3.2.1 — Representing text: character sets, 7-bit ASCII, Extended ASCII, Unicode UTF-8', assess: false, taught: false },
          y11: { text: 'Assessment feedback; 4.1 — Input-Process-Output & computational hardware models', assess: false, taught: false },
          y12: { text: 'B2.4 — Searching algorithms: linear search and binary search efficiency', assess: false, taught: false },
          y13: { text: 'A1.1 — Computer architecture: Von Neumann model, ALU, Control Unit, registers, FDE cycle', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 10,
        dates: '2–6 Nov',
        iso: '2026-11-02',
        flag: 'Assessments',
        note: 'Y9 Python assessment week.',
        cells: {
          y7: { text: 'Kodu graded project — game design document, storyboard and terrain design', assess: false, taught: false },
          y8: { text: 'Scratch assessment feedback + open-ended arcade game brief', assess: false, taught: false },
          y9: { text: 'Python Assessment 1 — variables, selection, loops and list manipulation', assess: true, taught: false },
          y10: { text: '3.2.2 — Bitmap graphics: pixel dimensions, resolution (DPI), colour depth calculations', assess: false, taught: false },
          y11: { text: '4.2.1–4.2.2 — Hardware components; Primary RAM, ROM, cache levels, virtual memory', assess: false, taught: false },
          y12: { text: 'B2.4 — Sorting algorithms: Bubble sort, Selection sort, Insertion sort & Big-O', assess: false, taught: false },
          y13: { text: 'A1.2 — Data representation: sign magnitude, two’s complement, floating point mantissa/exponent', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 11,
        dates: '9–13 Nov',
        iso: '2026-11-09',
        note: 'Y9 Python Functions introduction.',
        cells: {
          y7: { text: 'Kodu project — Build Phase 1: environment layout, player movement & basic enemies', assess: false, taught: false },
          y8: { text: 'Scratch project — sprite design, costume animations and backdrop staging', assess: false, taught: false },
          y9: { text: 'Feedback + Python 10 — defining custom functions and arguments', assess: false, taught: false },
          y10: { text: '3.2.3–3.2.4 — Digital sound: sample rate, bit depth, channels & file size formulas', assess: false, taught: false },
          y11: { text: '4.2.3 — Stored program concept, system clock, buses (data, address, control)', assess: false, taught: false },
          y12: { text: 'B2.5 — Persistent file streams: reading, writing and parsing CSV records', assess: false, taught: false },
          y13: { text: 'A1.2 — Logic circuits: Boolean gates (AND, OR, NOT, NAND, NOR, XOR), Karnaugh maps', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 12,
        dates: '16–20 Nov',
        iso: '2026-11-16',
        note: 'OOP concepts introduction in Y12.',
        cells: {
          y7: { text: 'Kodu project — Build Phase 2: custom scoring triggers, timers & game rules', assess: false, taught: false },
          y8: { text: 'Scratch project — Build Phase 1: game loop, collision physics & life counters', assess: false, taught: false },
          y9: { text: 'Python 11 — parameters, return values, functional abstraction', assess: false, taught: false },
          y10: { text: '3.3.1 & 3.3.4 — Storage units: bit, nibble, byte to tebibyte / terabyte conversions', assess: false, taught: false },
          y11: { text: '4.2.4–4.2.7 — Storage media (magnetic, optical, SSD), embedded systems & IoT', assess: false, taught: false },
          y12: { text: 'B3.1 — Object Oriented Programming: classes, instantiating objects, __init__ methods', assess: false, taught: false },
          y13: { text: 'A1.3 — Operating systems: scheduling, paging, interrupt handling, device drivers', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 13,
        dates: '23–27 Nov',
        iso: '2026-11-23',
        note: 'Y13 IA documentation deadline approaching.',
        cells: {
          y7: { text: 'Kodu project — Build Phase 3: multi-level progression, instructions & boss bots', assess: false, taught: false },
          y8: { text: 'Scratch project — Build Phase 2: power-ups, audio fx and game over states', assess: false, taught: false },
          y9: { text: 'Python 12 — string methods (.upper, .find, .split), slicing and validation', assess: false, taught: false },
          y10: { text: '3.3.2–3.3.3 — Data compression: lossy vs lossless, Run-Length Encoding (RLE) & Huffman', assess: false, taught: false },
          y11: { text: '4.3 — Truth tables, logic circuits and Boolean expressions (AND, OR, NOT, XOR)', assess: false, taught: false },
          y12: { text: 'B3.1 — Encapsulation, private attributes, getters/setters, static members', assess: false, taught: false },
          y13: { text: 'A1.4 — Translation: compilers, interpreters, assemblers, bytecode VMs', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 14,
        dates: '30 Nov – 4 Dec',
        iso: '2026-11-30',
        note: 'Pre-exam consolidation across all exam cohorts.',
        cells: {
          y7: { text: 'Kodu project — testing table, bug fixing, peer gameplay evaluation', assess: false, taught: false },
          y8: { text: 'Scratch project — Build Phase 3: difficulty balancing, bonus levels & polish', assess: false, taught: false },
          y9: { text: 'Python 13 — text adventure / quiz mini-project build with modular code', assess: false, taught: false },
          y10: { text: '3.4 — Cryptography: Caesar cipher, Pigpen, Vigenère cipher & Rail Fence cipher', assess: false, taught: false },
          y11: { text: '4.4–4.5 — System software: utility tools, backup, defragmentation, translators', assess: false, taught: false },
          y12: { text: 'B3.2 — Class inheritance, method overriding and polymorphic behaviour', assess: false, taught: false },
          y13: { text: 'IA Completion — final written report, 7-minute product video & appendices', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 15,
        dates: '7–11 Dec',
        iso: '2026-12-07',
        flag: 'Major Submissions',
        note: 'Key milestone: Y7/8/9 project submissions, Y10 Topic 3 exam, Y13 IA hand-in.',
        cells: {
          y7: { text: 'Kodu project final submission, evaluation write-up and peer showcase', assess: true, taught: false },
          y8: { text: 'Scratch arcade project submission, rubric self-assessment & peer trials', assess: true, taught: false },
          y9: { text: 'Python mini-project code submission, test run demonstrations', assess: true, taught: false },
          y10: { text: 'Topic 3 Assessment — Data representation, compression & cryptography written exam', assess: true, taught: false },
          y11: { text: 'Mock revision — Paper 1: Topics 1–4 theoretical exam technique', assess: false, taught: false },
          y12: { text: 'B4.1 HL — Abstract Data Types: Stack and Queue implementations with arrays/pointers', assess: false, taught: false },
          y13: { text: 'IA Official Submission; Mock revision — Theme A Computer Fundamentals', assess: true, taught: false }
        }
      },
      {
        kind: 'week',
        n: 16,
        dates: '14–16 Dec',
        iso: '2026-12-14',
        flag: 'Ends Wed · 12 noon finish',
        note: 'End of Term 1. Term awards, portfolio reflections and tidy up.',
        cells: {
          y7: { text: 'Computing Showcase, reflection log & Hour of Code winter challenges', assess: false, taught: false },
          y8: { text: 'Class arcade tournament, peer nominations & term reflection', assess: false, taught: false },
          y9: { text: 'Showcase, Python puzzle challenge & term review', assess: false, taught: false },
          y10: { text: 'Topic 3 examination feedback, target setting & holiday coding prep', assess: false, taught: false },
          y11: { text: 'Mock revision — Paper 2 timed practical programming workshop', assess: false, taught: false },
          y12: { text: 'B4.1 HL — Singly linked lists & binary search trees; term review', assess: false, taught: false },
          y13: { text: 'Mock revision — Theme B Algorithms & 2027 Case Study analysis', assess: false, taught: false }
        }
      },
      {
        kind: 'break',
        label: 'Christmas & New Year Holiday · 17 Dec – 5 Jan',
        detail: '4–5 Jan: Staff Training (no students). School reopens Wednesday 6 Jan 2027.'
      }
    ]
  },
  {
    id: 't2',
    name: 'Term 2 · Spring',
    dates: '6 Jan – 25 Mar 2027',
    weeks: 11,
    themeColor: '#57534e',
    rows: [
      {
        kind: 'week',
        n: 1,
        dates: '6–8 Jan',
        iso: '2027-01-06',
        flag: 'Wed start · 3 days',
        note: 'Term 2 begins. Y11 & Y13 Mock Exam series commences.',
        cells: {
          y7: { text: 'micro:bit 1 — hardware introduction, MakeCode simulator & first LEDs', assess: false, taught: false },
          y8: { text: 'HTML 1 — How the Web works, client vs server, <!DOCTYPE>, HTML boilerplate', assess: false, taught: false },
          y9: { text: 'Thunkable 1 — Mobile app ecosystem, drag-and-drop designer, responsive screens', assess: false, taught: false },
          y10: { text: 'Python IDE environment setup, code formatting conventions, variables & constants', assess: false, taught: false },
          y11: { text: 'Mock Exam — Paper 1: Principles of Computer Science (2 hours written)', assess: true, taught: false },
          y12: { text: 'A3.1 — Database fundamentals: flat files vs relational databases, DBMS architecture', assess: false, taught: false },
          y13: { text: 'Mock Exam — Paper 1: IB DP Computer Science (Theme A + Case Study)', assess: true, taught: false }
        }
      },
      {
        kind: 'week',
        n: 2,
        dates: '11–15 Jan',
        iso: '2027-01-11',
        flag: 'Mock Exams',
        note: 'Y11 & Y13 Mock Paper 2 practical exams.',
        cells: {
          y7: { text: 'micro:bit 2 — 5x5 LED matrix icons, strings & physical button events (A/B)', assess: false, taught: false },
          y8: { text: 'HTML 2 — Headings (h1–h6), paragraphs, ordered/unordered lists & hyperlinks', assess: false, taught: false },
          y9: { text: 'Thunkable 2 — UI components: buttons, text inputs, images & labels', assess: false, taught: false },
          y10: { text: '2.4.1 & 2.5.1 — Input, output, string concatenation, integer/float arithmetic', assess: false, taught: false },
          y11: { text: 'Mock Exam — Paper 2: Application of Computational Thinking (3-hour practical)', assess: true, taught: false },
          y12: { text: 'A3.2 — Database design: Entities, attributes, primary/foreign keys & ER diagrams', assess: false, taught: false },
          y13: { text: 'Mock Exam — Paper 2: IB DP Computer Science (Theme B & OOP)', assess: true, taught: false }
        }
      },
      {
        kind: 'week',
        n: 3,
        dates: '18–22 Jan',
        iso: '2027-01-18',
        note: 'Detailed mock examination feedback and targeted intervention groups.',
        cells: {
          y7: { text: 'micro:bit 3 — variables, score counters, random number generators', assess: false, taught: false },
          y8: { text: 'HTML 3 — embedded images (alt text), tables & structural <div> tags', assess: false, taught: false },
          y9: { text: 'Thunkable 3 — visual block logic, event listeners and sound effects', assess: false, taught: false },
          y10: { text: '2.2.2 — Relational operators (==, !=, <, >), logical operators (and, or, not)', assess: false, taught: false },
          y11: { text: 'Mock feedback, question-by-question examiner report analysis & gap fill', assess: false, taught: false },
          y12: { text: 'A3.2 — Data integrity, referential integrity rules, 1NF, 2NF, 3NF normalisation', assess: false, taught: false },
          y13: { text: 'Mock feedback, error remediation & syllabus gap analysis', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 4,
        dates: '25–29 Jan',
        iso: '2027-01-25',
        note: 'CSS formatting fundamentals in Y8.',
        cells: {
          y7: { text: 'micro:bit 4 — forever loops, while loops and conditional sensors', assess: false, taught: false },
          y8: { text: 'CSS 1 — CSS syntax, inline vs internal vs external stylesheets, colour hex codes', assess: false, taught: false },
          y9: { text: 'Thunkable 4 — app variables, user data input and calculation logic', assess: false, taught: false },
          y10: { text: '2.2.2 — Iteration structures: for loops with range, while loops, nested iterations', assess: false, taught: false },
          y11: { text: '5.1.1–5.1.4 — Network types (LAN, WAN, PAN), client-server vs peer-to-peer, wired/wireless', assess: false, taught: false },
          y12: { text: 'A3.3 — SQL query language: SELECT, FROM, WHERE, ORDER BY, DISTINCT', assess: false, taught: false },
          y13: { text: 'A4.1 — Machine Learning fundamentals: training datasets, features, classification vs regression', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 5,
        dates: '1–5 Feb',
        iso: '2027-02-01',
        note: 'Physical sensors and hardware computing in Y7.',
        cells: {
          y7: { text: 'micro:bit 5 — onboard sensors: light level, temperature, accelerometer shake/tilt', assess: false, taught: false },
          y8: { text: 'CSS 2 — The CSS box model: margin, border, padding, content and dimensioning', assess: false, taught: false },
          y9: { text: 'Thunkable 5 — multi-screen mobile apps, navigation drawer & tab navigators', assess: false, taught: false },
          y10: { text: '2.1.3–2.1.5 — Error categories (syntax, runtime, logic), test plans & test data', assess: false, taught: false },
          y11: { text: '5.1.5–5.1.6 — Network protocols (HTTP, HTTPS, FTP, SMTP, IMAP) & TCP/IP stack layers', assess: false, taught: false },
          y12: { text: 'A3.3 — Multi-table SQL: INNER JOIN, aggregate functions (COUNT, SUM, AVG, GROUP BY)', assess: false, taught: false },
          y13: { text: 'A4.2 — Data preprocessing, normalisation, cleaning and feature selection', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 6,
        dates: '8–12 Feb',
        iso: '2027-02-08',
        note: 'Y7 micro:bit radio networking before half term.',
        cells: {
          y7: { text: 'micro:bit 6 — 2.4GHz radio broadcasts, sending packets, multi-device games', assess: false, taught: false },
          y8: { text: 'CSS 3 — flexbox layout model, horizontal navigation bars and button styling', assess: false, taught: false },
          y9: { text: 'Thunkable 6 — local data persistence, list storage and persistent user settings', assess: false, taught: false },
          y10: { text: '2.3.2 — 1-dimensional array manipulation, indexing and list traversal', assess: false, taught: false },
          y11: { text: '5.1.7–5.1.8 — Network topologies (star, mesh, bus) & mobile standards (4G/5G/Wi-Fi 6)', assess: false, taught: false },
          y12: { text: 'A3.4 — Distributed databases, ACID compliance vs BASE, data redundancy', assess: false, taught: false },
          y13: { text: 'A4.3 — Supervised learning (k-NN, Decision Trees) vs unsupervised clustering (k-Means)', assess: false, taught: false }
        }
      },
      {
        kind: 'break',
        label: 'Spring Half Term Holiday · 15–19 Feb',
        detail: 'School closed for half term. Classes resume Monday 22 Feb 2027.'
      },
      {
        kind: 'week',
        n: 7,
        dates: '22–26 Feb',
        iso: '2027-02-22',
        note: 'Launch of major second-half Term 2 projects.',
        cells: {
          y7: { text: 'micro:bit project — design brief: smart home alarm, step counter or digital pet', assess: false, taught: false },
          y8: { text: 'CSS 4 — responsive design principles, media queries & mobile viewport', assess: false, taught: false },
          y9: { text: 'Thunkable App project — project brief: utility/educational mobile app design', assess: false, taught: false },
          y10: { text: '2.3.2 — 2-dimensional arrays, matrix grid coordinates & nested loop traversal', assess: false, taught: false },
          y11: { text: '5.2.1–5.2.3 — Cyber security: malware types, phishing, brute force, DDoS, SQL injection', assess: false, taught: false },
          y12: { text: 'IA Launch — IB Computational Solution criteria, scoping real clients & problem identification', assess: false, taught: false },
          y13: { text: 'A4.3 — Neural networks: perceptrons, weights, biases, backpropagation & AI ethics', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 8,
        dates: '1–5 Mar',
        iso: '2027-03-01',
        note: 'Year 12 IA Planning criteria A/B.',
        cells: {
          y7: { text: 'micro:bit project — Build 1: core sensor logic, input triggers & state variables', assess: false, taught: false },
          y8: { text: 'Revision & hands-on HTML/CSS coding challenges', assess: false, taught: false },
          y9: { text: 'Thunkable App project — Build 1: screen layouts, visual theme & UI navigation', assess: false, taught: false },
          y10: { text: '2.3.3 & 2.4.2 — String manipulation functions (.length, substring, formatting) & validation', assess: false, taught: false },
          y11: { text: '5.2.4–5.2.5 — System defence: firewalls, access control lists, patching, penetration testing', assess: false, taught: false },
          y12: { text: 'IA — Criterion A: problem description, client interview & measurable success criteria', assess: false, taught: false },
          y13: { text: 'Case Study — in-depth guided study of the official IB DP 2027 Case Study dossier', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 9,
        dates: '8–12 Mar',
        iso: '2027-03-08',
        flag: 'Assessments',
        note: 'Y8 HTML/CSS assessment week.',
        cells: {
          y7: { text: 'micro:bit project — Build 2: sound alerts, LED animations & enclosure mockups', assess: false, taught: false },
          y8: { text: 'HTML & CSS Assessment — responsive web page construction & styling under exam conditions', assess: true, taught: false },
          y9: { text: 'Thunkable App project — Build 2: core data algorithms, list views & user logic', assess: false, taught: false },
          y10: { text: '2.6 — Subprograms: custom functions, procedure parameters, return values & local scope', assess: false, taught: false },
          y11: { text: '5.3 — The Internet & WWW: IP addressing (IPv4 vs IPv6), DNS resolution, URL routing', assess: false, taught: false },
          y12: { text: 'IA — Criterion B: system architecture diagrams, data structure design & test plan', assess: false, taught: false },
          y13: { text: 'Case Study — Paper 1 Section B extended response exam technique & practice', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 10,
        dates: '15–19 Mar',
        iso: '2027-03-15',
        flag: '15 Mar Public Holiday',
        note: '15 Mar: National Holiday (no school, 4-day week).',
        cells: {
          y7: { text: 'micro:bit project — Build 3: testing against criteria, calibration & bug fixing', assess: false, taught: false },
          y8: { text: 'HTML/CSS assessment feedback, corrections & web accessibility standards', assess: false, taught: false },
          y9: { text: 'Thunkable App project — Build 3: app testing on physical phones & bug fixes', assess: false, taught: false },
          y10: { text: '2.4.3 — File processing: reading records from text/CSV files & writing output logs', assess: false, taught: false },
          y11: { text: 'Revision — Paper 1 comprehensive walkthrough across all 6 specification topics', assess: false, taught: false },
          y12: { text: 'IA — Criterion C: development begins; repository setup & core code modules', assess: false, taught: false },
          y13: { text: 'Revision — Paper 1: Themes A1 to A4 rapid review and past question drills', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 11,
        dates: '22–25 Mar',
        iso: '2027-03-22',
        flag: 'Ends Thu · 12 noon finish',
        note: 'End of Term 2. Last day Thursday 25 March (noon finish). Year 11 completes taught course before study leave!',
        cells: {
          y7: { text: 'micro:bit project submission, live hardware demonstrations & peer evaluation', assess: true, taught: false },
          y8: { text: 'Term 3 Website client project brief issued & topic selection', assess: false, taught: false },
          y9: { text: 'Thunkable Mobile App submission, presentation demos & peer voting', assess: true, taught: false },
          y10: { text: '2.1.6–2.1.7 — Program trace tables; evaluating algorithm efficiency & refactoring', assess: false, taught: false },
          y11: { text: 'Revision — Paper 2 timed practical programming & final exam technique (Course complete)', assess: false, taught: false },
          y12: { text: 'IA — Development milestone 1; database integration review', assess: false, taught: false },
          y13: { text: 'Revision — Paper 2: Themes B1 to B4, OOP design & algorithmic tracing', assess: false, taught: false }
        }
      },
      {
        kind: 'break',
        label: 'Spring & Easter Holiday · 26 Mar – 12 Apr',
        detail: 'School closed for Spring Break. Term 3 resumes Tuesday 13 April 2027.'
      }
    ]
  },
  {
    id: 't3',
    name: 'Term 3 · Summer',
    dates: '13 Apr – 24 Jun 2027',
    weeks: 11,
    themeColor: '#334155',
    rows: [
      {
        kind: 'week',
        n: 1,
        dates: '13–16 Apr',
        iso: '2027-04-13',
        flag: 'Tue start',
        note: 'Term 3 start. Y11 enters final revision phase before study leave.',
        cells: {
          y7: { text: 'Robotics 1 — LEGO / Arduino robotics kit introduction, motors and directional locomotion', assess: false, taught: false },
          y8: { text: 'Website project — project planning, wireframing, sitemap & UX asset gathering', assess: false, taught: false },
          y9: { text: 'Computer Networks 1 — network hardware: NICs, switches, routers, transmission media', assess: false, taught: false },
          y10: { text: '1.1.1–1.1.3 — Algorithm specification: flowchart standards, pseudocode & written descriptions', assess: false, taught: false },
          y11: { text: 'Revision — Topics 1 & 2: Computational problem solving & programming paradigms', assess: false, taught: false },
          y12: { text: 'IA — Development Sprint 1: frontend client UI and CRUD functionality', assess: false, taught: false },
          y13: { text: 'Revision — B2 programming constructs and B3 OOP inheritance structures', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 2,
        dates: '19–23 Apr',
        iso: '2027-04-19',
        note: 'Y13 final on-campus revision before IB exams.',
        cells: {
          y7: { text: 'Robotics 2 — optical infrared sensors, line-following algorithms & calibration', assess: false, taught: false },
          y8: { text: 'Website project — HTML structure, semantic tags (<header>, <nav>, <main>, <footer>)', assess: false, taught: false },
          y9: { text: 'Computer Networks 2 — LAN, WAN, star and mesh network topologies & wireless APs', assess: false, taught: false },
          y10: { text: '1.1.4–1.1.6 — Tracing algorithm output, trace table validation & translating logic to Python', assess: false, taught: false },
          y11: { text: 'Revision — Topic 3: Data representation, binary arithmetic & image/sound encoding', assess: false, taught: false },
          y12: { text: 'IA — Development Sprint 2: complex algorithms and data validation routines', assess: false, taught: false },
          y13: { text: 'Revision — B4 Abstract Data Types; A1 Computer Architecture & Logic circuits', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 3,
        dates: '26–30 Apr',
        iso: '2027-04-26',
        note: 'Y11/13 Study Leave commences.',
        cells: {
          y7: { text: 'Robotics 3 — ultrasonic distance sensors, obstacle avoidance & state machines', assess: false, taught: false },
          y8: { text: 'Website project — CSS styling: colour schemes, typography, layout & responsive cards', assess: false, taught: false },
          y9: { text: 'Computer Networks 3 — The global Internet, IP addressing, DNS resolution & packet headers', assess: false, taught: false },
          y10: { text: '1.1.8 — Sorting algorithms: Bubble sort walkthrough vs Merge sort divide-and-conquer', assess: false, taught: false },
          y11: { text: 'Revision — Topic 4: CPU architecture, memory hierarchy & system software', assess: false, taught: false },
          y12: { text: 'IA — Development Sprint 3: test data runs, progress check & code comments', assess: false, taught: false },
          y13: { text: 'Final revision — A2, A3, A4 & Case Study masterclass; Study leave begins', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 4,
        dates: '3–7 May',
        iso: '2027-05-03',
        flag: 'IB Exams Begin',
        note: '1 May Public Holiday occurred over weekend. IB DP May 2027 Exam session begins.',
        cells: {
          y7: { text: 'Robotics project — team briefs: maze navigation challenge or automated sumo bot', assess: false, taught: false },
          y8: { text: 'Website project — Build Phase 1: home page, navigation links & responsive grid', assess: false, taught: false },
          y9: { text: 'Computer Networks 4 — network protocols (TCP, IP, UDP, HTTP, HTTPS) & packet simulation', assess: false, taught: false },
          y10: { text: '1.1.7–1.1.8 — Searching algorithms: Linear vs Binary search efficiency & prerequisites', assess: false, taught: false },
          y11: { text: 'Revision — Topics 5 & 6: Computer networks, cyber threats & ethical considerations', assess: false, taught: false },
          y12: { text: 'Revision — Theme B: programming, OOP design patterns & abstract data types', assess: false, taught: false },
          y13: { text: 'IB Diploma Examinations — Official May 2027 Examination Session', assess: true, taught: false }
        }
      },
      {
        kind: 'week',
        n: 5,
        dates: '10–14 May',
        iso: '2027-05-10',
        note: 'IB Exams ongoing; Y11 past paper practice.',
        cells: {
          y7: { text: 'Robotics project — Build Phase 1: chassis build, motor testing & basic sensor loops', assess: false, taught: false },
          y8: { text: 'Website project — Build Phase 2: content pages, contact forms & media galleries', assess: false, taught: false },
          y9: { text: 'Computer Networks 5 — cyber security, social engineering threats, phishing & defence', assess: false, taught: false },
          y10: { text: '1.2 — Problem solving techniques: decomposition, pattern recognition, abstraction & evaluation', assess: false, taught: false },
          y11: { text: 'Full past paper — Edexcel Paper 1 & Paper 2 timed mock conditions in exam hall', assess: false, taught: false },
          y12: { text: 'Revision — Theme A3: Relational databases, SQL queries & normalisation', assess: false, taught: false },
          y13: { text: 'IB Diploma Examinations continue', assess: true, taught: false }
        }
      },
      {
        kind: 'week',
        n: 6,
        dates: '17–21 May',
        iso: '2027-05-17',
        flag: '17–18 May Whitsun Holiday · 3 days',
        note: '17–18 May Whitsun holiday (no school Mon/Tue). 3-day school week.',
        cells: {
          y7: { text: 'Robotics project — Build Phase 2: speed optimisation, turn calibration & obstacle test', assess: false, taught: false },
          y8: { text: 'Website project — Build Phase 3: interactive JavaScript / CSS animations & styling', assess: false, taught: false },
          y9: { text: 'Presentation brief issued: Emerging technologies / AI / Cyber Ethics research', assess: false, taught: false },
          y10: { text: 'Revision — Paper 2 practical programming workshops & edge-case debugging', assess: false, taught: false },
          y11: { text: 'Exam technique masterclass, high-frequency command words & individual gap fill', assess: false, taught: false },
          y12: { text: 'Revision — Paper technique, past exam question marking schemes & model answers', assess: false, taught: false },
          y13: { text: 'IB Diploma Examinations conclude', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 7,
        dates: '24–28 May',
        iso: '2027-05-24',
        flag: 'Assessments',
        note: 'Y10 End of Year Exams; Y12 End of Year Exams.',
        cells: {
          y7: { text: 'Robotics project — Build Phase 3: obstacle maze trial runs & code refinements', assess: false, taught: false },
          y8: { text: 'Website project — cross-browser testing, mobile responsiveness & validator check', assess: false, taught: false },
          y9: { text: 'Research and planning: slide deck structure, tech demo & bibliography sources', assess: false, taught: false },
          y10: { text: 'End-of-Year Assessment — Edexcel IGCSE Paper 1 & Paper 2 combined exam series', assess: true, taught: false },
          y11: { text: 'Study leave — Independent final prep for June exam papers', assess: false, taught: false },
          y12: { text: 'End-of-Year Examination — IB DP Computer Science Paper 1 & Paper 2', assess: true, taught: false },
          y13: { text: 'Graduation celebrations & alumni transition', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 8,
        dates: '31 May – 4 Jun',
        iso: '2027-05-31',
        flag: 'IGCSE Exams',
        note: 'Edexcel IGCSE June exam series underway for Y11.',
        cells: {
          y7: { text: 'Robotics project — final test runs, timed course challenges & code documentation', assess: false, taught: false },
          y8: { text: 'Website project submission, rubric peer grading & website showcase', assess: true, taught: false },
          y9: { text: 'Slide preparation, rehearsing public speaking & demonstration rehearsals', assess: false, taught: false },
          y10: { text: 'Assessment feedback, exam paper review and targeted misconception reteach', assess: false, taught: false },
          y11: { text: 'IGCSE Examinations (4CP0) — Pearson Edexcel June series Paper 1 & Paper 2', assess: true, taught: false },
          y12: { text: 'Exam feedback & post-mortem; IA Development resumes in earnest', assess: false, taught: false },
          y13: { text: 'Post-exam celebrations', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 9,
        dates: '7–11 Jun',
        iso: '2027-06-07',
        flag: 'Presentations',
        note: 'Departmental Presentation week across KS3 cohorts.',
        cells: {
          y7: { text: 'Robotics Showcase & Tournament — Group 1 arena obstacle runs', assess: true, taught: false },
          y8: { text: 'Web Design Awards — Group 1 live website presentations & peer critique', assess: true, taught: false },
          y9: { text: 'Tech Presentations — Group 1: Emerging tech, AI ethics & cyber warfare', assess: true, taught: false },
          y10: { text: '6.1.1 — Environmental impact of technology: e-waste, energy consumption & green computing', assess: false, taught: false },
          y11: { text: 'IGCSE Examinations continue', assess: false, taught: false },
          y12: { text: 'IA — Criterion D: product functionality video demo & written documentation', assess: false, taught: false },
          y13: { text: '', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 10,
        dates: '14–18 Jun',
        iso: '2027-06-14',
        flag: 'Presentations',
        note: 'Final presentations & judging.',
        cells: {
          y7: { text: 'Robotics Showcase & Tournament — Group 2 arena finals & award ceremony', assess: true, taught: false },
          y8: { text: 'Web Design Awards — Group 2 presentations & certificate distribution', assess: true, taught: false },
          y9: { text: 'Tech Presentations — Group 2 presentations & audience Q&A sessions', assess: true, taught: false },
          y10: { text: '6.1.2–6.1.3 — Ethical and legal impact: GDPR, Copyright, Patents, open source vs proprietary', assess: false, taught: false },
          y11: { text: '', assess: false, taught: false },
          y12: { text: 'IA — Criterion E: testing against success criteria & critical evaluation draft', assess: false, taught: false },
          y13: { text: '', assess: false, taught: false }
        }
      },
      {
        kind: 'week',
        n: 11,
        dates: '21–24 Jun',
        iso: '2027-06-21',
        flag: 'Ends Thu · 12 noon finish',
        note: 'Last week of the school year. Thursday 24 June (12 noon finish). Friday 25 June staff training.',
        cells: {
          y7: { text: 'Computing Year 7 Showcase, hardware inventory & summer STEM challenges', assess: false, taught: false },
          y8: { text: 'Year 8 Computing reflection portfolio & Year 9 elective preparation', assess: false, taught: false },
          y9: { text: 'KS3 reflection, celebration & bridging workshop into IGCSE Computer Science', assess: false, taught: false },
          y10: { text: '6.1.4 — Emerging trends: Quantum computing, DNA data storage, AI & Year 11 summer targets', assess: false, taught: false },
          y11: { text: '', assess: false, taught: false },
          y12: { text: 'IA progress review, Criterion A–E summer completion targets for Year 13', assess: false, taught: false },
          y13: { text: '', assess: false, taught: false }
        }
      }
    ]
  }
];
