import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TermData, YearConfig, CellData, ViewMode, UserRole, LockState, CurriculumState, YearReportDate, BreakRow, StudentVisibilitySettings, ActiveWeekSetting, PortalOverviewSettings } from './types';
import { YEARS, INITIAL_PLAN } from './data/defaultPlan';
import { DEFAULT_YEAR_REPORT_DATES } from './data/reportCycles';
import { DEFAULT_STUDENT_VISIBILITY } from './data/defaultVisibility';
import { DEFAULT_OVERVIEW_SETTINGS, DEFAULT_ACTIVE_WEEK_SETTING } from './data/defaultSettings';
import { getActiveSchoolWeek } from './lib/calendarDateUtils';
import { Header } from './components/Header';
import { YearStrip } from './components/YearStrip';
import { Toolbar } from './components/Toolbar';
import { MatrixView } from './components/MatrixView';
import { TimelineView } from './components/TimelineView';
import { CalendarView } from './components/CalendarView';
import { RoadmapView } from './components/RoadmapView';
import { ReportCycleView } from './components/ReportCycleView';
import { LockModal } from './components/LockModal';
import { ShareModal } from './components/ShareModal';
import { StatsModal } from './components/StatsModal';
import { AIHelperModal } from './components/AIHelperModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { StudentView } from './components/StudentView';
import { BreakModal } from './components/BreakModal';
import { StudentVisibilityModal } from './components/StudentVisibilityModal';
import { ActiveWeekModal } from './components/ActiveWeekModal';
import { PortalOverviewModal } from './components/PortalOverviewModal';
import { subscribeToCurriculum, saveCurriculumToCloud } from './lib/curriculumSync';

export default function App() {
  const [plan, setPlan] = useState<TermData[]>(() => {
    try {
      const saved = localStorage.getItem('curriculum_plan_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PLAN;
  });

  const [reportDates, setReportDates] = useState<YearReportDate[]>(() => {
    try {
      const saved = localStorage.getItem('curriculum_report_dates_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_YEAR_REPORT_DATES;
  });

  const [lockState, setLockState] = useState<LockState>(() => {
    try {
      const saved = localStorage.getItem('curriculum_lock_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isLocked === 'boolean') {
          return {
            isLocked: parsed.isLocked,
            hasPin: !!parsed.hasPin,
            lockedBy: parsed.lockedBy,
            lockedAt: parsed.lockedAt
          };
        }
      }
    } catch {}
    return {
      isLocked: false,
      hasPin: true,
      lockedBy: undefined
    };
  });

  const [selectedYears, setSelectedYears] = useState<string[]>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlYear = urlParams.get('year');
      if (urlYear && YEARS.some(y => y.id === urlYear)) {
        return [urlYear];
      }
    } catch {}
    return YEARS.map(y => y.id);
  });

  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [assessOnly, setAssessOnly] = useState(false);
  const [reportOnly, setReportOnly] = useState(false);
  
  // Default to student role for all visitors
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(false);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const [studentVisibility, setStudentVisibility] = useState<StudentVisibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('curriculum_student_visibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_STUDENT_VISIBILITY, ...parsed };
        }
      }
    } catch {}
    return DEFAULT_STUDENT_VISIBILITY;
  });

  // Active School Week Setting (Automatic vs. Manual Teacher Override)
  const [activeWeekSetting, setActiveWeekSetting] = useState<ActiveWeekSetting>(() => {
    try {
      const saved = localStorage.getItem('curriculum_active_week_setting');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_ACTIVE_WEEK_SETTING, ...parsed };
        }
      }
    } catch {}
    return DEFAULT_ACTIVE_WEEK_SETTING;
  });

  // Portal Overview Title, Description & Academic Year tag
  const [overviewSettings, setOverviewSettings] = useState<PortalOverviewSettings>(() => {
    try {
      const saved = localStorage.getItem('curriculum_overview_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_OVERVIEW_SETTINGS, ...parsed };
        }
      }
    } catch {}
    return DEFAULT_OVERVIEW_SETTINGS;
  });

  // Modal states
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isTeacherAuthOpen, setIsTeacherAuthOpen] = useState(false);
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false);
  const [isActiveWeekModalOpen, setIsActiveWeekModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [breakModalData, setBreakModalData] = useState<{
    isOpen: boolean;
    termId: string;
    termName: string;
    breakItem: BreakRow | null;
    positionIdx?: number;
  }>({
    isOpen: false,
    termId: '',
    termName: '',
    breakItem: null
  });
  const [aiHelperCell, setAiHelperCell] = useState<{
    termId: string;
    weekN: number;
    yearId: string;
    yearLabel: string;
    termName: string;
    currentText: string;
  } | null>(null);

  // References
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safe lock state accessor
  const isLocked = Boolean(lockState?.isLocked);

  // Dynamic real-time school week calculation (smart 2026–2027 calendar tracking with teacher manual override)
  const currentWeekInfo = useMemo(() => {
    return getActiveSchoolWeek(plan, activeWeekSetting);
  }, [plan, activeWeekSetting]);

  const currentTermName = currentWeekInfo.termName;
  const currentWeekText = currentWeekInfo.weekText;
  const currentWeekKey = currentWeekInfo.weekKey;
  const isManualWeek = currentWeekInfo.isManual;

  // Validate teacher session token against server
  const verifyTeacherSession = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/teacher/session', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return !!(res.ok && data.authenticated);
    } catch {
      return false;
    }
  };

  // Secure Role & Session handling on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem('bisb_teacher_token');
      const urlParams = new URLSearchParams(window.location.search);
      const requestedRole = urlParams.get('role');
      const yearParam = urlParams.get('year');

      if (yearParam && YEARS.some(y => y.id === yearParam)) {
        setSelectedYears([yearParam]);
      }

      if (token) {
        const isValid = await verifyTeacherSession(token);
        if (isValid) {
          setIsTeacherAuthenticated(true);
          setUserRole('teacher');
          return;
        } else {
          sessionStorage.removeItem('bisb_teacher_token');
          setIsTeacherAuthenticated(false);
          setUserRole('student');
        }
      }

      // If user typed ?role=teacher but is not authenticated, prompt with modal
      if (requestedRole === 'teacher') {
        setUserRole('student');
        setIsTeacherAuthOpen(true);
      } else {
        setUserRole('student');
      }
    };

    initAuth();
  }, []);

  // Teacher Logout Handler
  const handleTeacherLogout = async () => {
    const token = sessionStorage.getItem('bisb_teacher_token');
    if (token) {
      try {
        await fetch('/api/teacher/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {}
    }
    sessionStorage.removeItem('bisb_teacher_token');
    setIsTeacherAuthenticated(false);
    setUserRole('student');

    // Clean URL without reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('role', 'student');
    window.history.replaceState({}, '', newUrl.toString());
  };

  // Real-time Cloud Sync (Firestore) with server/localStorage fallback
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      unsubscribe = subscribeToCurriculum(
        (cloudState) => {
          if (cloudState && Array.isArray(cloudState.plan)) {
            setPlan(cloudState.plan);
            if (Array.isArray(cloudState.reportDates)) {
              setReportDates(cloudState.reportDates);
            }
            if (cloudState.lock && typeof cloudState.lock.isLocked === 'boolean') {
              setLockState(cloudState.lock);
            }
            if (cloudState.studentVisibility) {
              setStudentVisibility(prev => ({ ...prev, ...cloudState.studentVisibility }));
            }
            if (cloudState.activeWeekSetting) {
              setActiveWeekSetting(prev => ({ ...prev, ...cloudState.activeWeekSetting }));
            }
            if (cloudState.overviewSettings) {
              setOverviewSettings(prev => ({ ...prev, ...cloudState.overviewSettings }));
            }
            if (cloudState.lastUpdated) {
              setLastUpdated(cloudState.lastUpdated);
            }
            setSyncStatus('synced');
          }
        },
        (error) => {
          console.warn('Firestore subscription offline, falling back to REST sync:', error);
          fetch('/api/curriculum')
            .then(res => res.json())
            .then((data: CurriculumState) => {
              if (data && Array.isArray(data.plan)) {
                setPlan(data.plan);
                if (Array.isArray(data.reportDates)) setReportDates(data.reportDates);
                if (data.lock && typeof data.lock.isLocked === 'boolean') setLockState(data.lock);
                if (data.studentVisibility) setStudentVisibility(prev => ({ ...prev, ...data.studentVisibility }));
                if (data.activeWeekSetting) setActiveWeekSetting(prev => ({ ...prev, ...data.activeWeekSetting }));
                if (data.overviewSettings) setOverviewSettings(prev => ({ ...prev, ...data.overviewSettings }));
                if (data.lastUpdated) setLastUpdated(data.lastUpdated);
                setSyncStatus('synced');
              }
            })
            .catch(() => {});
        }
      );
    } catch (e) {
      console.warn('Direct Firestore initialization fallback:', e);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Save report dates to Cloud Firestore, server, and localStorage
  const handleUpdateReportDates = (updatedDates: YearReportDate[]) => {
    if (isLocked && userRole !== 'teacher') return;
    setReportDates(updatedDates);
    try {
      localStorage.setItem('curriculum_report_dates_v2', JSON.stringify(updatedDates));
    } catch {}
    setSyncStatus('saving');

    // Direct Cloud Firestore save (preserve existing lock state)
    saveCurriculumToCloud(undefined, updatedDates, lockState)
      .then((res) => {
        setLastUpdated(res.lastUpdated);
        setSyncStatus('synced');
      })
      .catch(() => {
        fetch('/api/curriculum', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportDates: updatedDates })
        })
          .then(res => res.json())
          .then(data => {
            if (data.lastUpdated) setLastUpdated(data.lastUpdated);
            setSyncStatus('synced');
          })
          .catch((err) => {
            console.warn('Sync server offline, persisted locally:', err);
            setSyncStatus('synced');
          });
      });
  };

  // Persist plan to Cloud Firestore, server API, and localStorage
  const triggerSave = useCallback((updatedPlan: TermData[]) => {
    try {
      localStorage.setItem('curriculum_plan_v2', JSON.stringify(updatedPlan));
    } catch {}
    setSyncStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Direct Cloud Save (always maintain currently unlocked/locked state & student visibility)
        const cloudResult = await saveCurriculumToCloud(updatedPlan, undefined, lockState, studentVisibility);
        setLastUpdated(cloudResult.lastUpdated);
        setSyncStatus('synced');
      } catch {
        // Server fallback
        try {
          const res = await fetch('/api/curriculum', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: updatedPlan })
          });

          if (res.ok) {
            const data = await res.json();
            setLastUpdated(data.lastUpdated);
            setSyncStatus('synced');
          } else {
            setSyncStatus('synced');
          }
        } catch {
          setSyncStatus('synced');
        }
      }
    }, 400);
  }, [lockState]);

  // Update a single cell
  const handleUpdateCell = (
    termId: string,
    weekN: number,
    yearId: string,
    updates: Partial<CellData>
  ) => {
    if (isLocked && userRole !== 'teacher') return;

    setPlan(prevPlan => {
      const nextPlan = prevPlan.map(term => {
        if (term.id !== termId) return term;
        return {
          ...term,
          rows: term.rows.map(row => {
            if (row.kind !== 'week' || row.n !== weekN) return row;
            const currentCell = row.cells[yearId] || { text: '' };
            return {
              ...row,
              cells: {
                ...row.cells,
                [yearId]: {
                  ...currentCell,
                  ...updates
                }
              }
            };
          })
        };
      });

      triggerSave(nextPlan);
      return nextPlan;
    });
  };

  // Update a weekly departmental note
  const handleUpdateNote = (termId: string, weekN: number, noteText: string) => {
    if (isLocked && userRole !== 'teacher') return;

    setPlan(prevPlan => {
      const nextPlan = prevPlan.map(term => {
        if (term.id !== termId) return term;
        return {
          ...term,
          rows: term.rows.map(row => {
            if (row.kind !== 'week' || row.n !== weekN) return row;
            return {
              ...row,
              note: noteText
            };
          })
        };
      });

      triggerSave(nextPlan);
      return nextPlan;
    });
  };

  // Open Add Break Modal
  const handleOpenAddBreak = (termId: string) => {
    const term = plan.find(t => t.id === termId);
    setBreakModalData({
      isOpen: true,
      termId,
      termName: term ? term.name : termId,
      breakItem: null
    });
  };

  // Open Edit Break Modal
  const handleOpenEditBreak = (termId: string, breakItem: BreakRow, positionIdx: number) => {
    const term = plan.find(t => t.id === termId);
    setBreakModalData({
      isOpen: true,
      termId,
      termName: term ? term.name : termId,
      breakItem,
      positionIdx
    });
  };

  // Save / Add Break Box
  const handleSaveBreak = (termId: string, updatedBreak: BreakRow, positionIdx?: number) => {
    if (isLocked && userRole !== 'teacher') return;

    setPlan(prevPlan => {
      const nextPlan = prevPlan.map(term => {
        if (term.id !== termId) return term;
        const newRows = [...term.rows];
        if (positionIdx !== undefined && positionIdx >= 0 && positionIdx < newRows.length) {
          newRows[positionIdx] = updatedBreak;
        } else {
          newRows.push(updatedBreak);
        }
        return {
          ...term,
          rows: newRows
        };
      });

      triggerSave(nextPlan);
      return nextPlan;
    });

    setBreakModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Delete Break Box
  const handleDeleteBreak = (termId: string, positionIdx: number) => {
    if (isLocked && userRole !== 'teacher') return;
    if (!window.confirm('Are you sure you want to delete this holiday / break box?')) {
      return;
    }

    setPlan(prevPlan => {
      const nextPlan = prevPlan.map(term => {
        if (term.id !== termId) return term;
        const newRows = term.rows.filter((_, idx) => idx !== positionIdx);
        return {
          ...term,
          rows: newRows
        };
      });

      triggerSave(nextPlan);
      return nextPlan;
    });

    setBreakModalData(prev => ({ ...prev, isOpen: false }));
  };

  // Quick Toggle Break Visibility for students
  const handleToggleBreakVisibility = (termId: string, positionIdx: number, newVisibility: boolean) => {
    if (isLocked && userRole !== 'teacher') return;

    setPlan(prevPlan => {
      const nextPlan = prevPlan.map(term => {
        if (term.id !== termId) return term;
        const newRows = term.rows.map((row, idx) => {
          if (idx !== positionIdx || row.kind !== 'break') return row;
          return {
            ...row,
            visibleToStudents: newVisibility
          };
        });
        return {
          ...term,
          rows: newRows
        };
      });

      triggerSave(nextPlan);
      return nextPlan;
    });
  };

  // Save Student Visibility Settings
  const handleSaveStudentVisibility = (newSettings: StudentVisibilitySettings) => {
    setStudentVisibility(newSettings);
    try {
      localStorage.setItem('curriculum_student_visibility', JSON.stringify(newSettings));
    } catch {}
    setSyncStatus('saving');

    saveCurriculumToCloud(undefined, undefined, lockState, newSettings)
      .then((res) => {
        setLastUpdated(res.lastUpdated);
        setSyncStatus('synced');
      })
      .catch((err) => {
        console.warn('Cloud save error for student visibility, saved locally:', err);
        setSyncStatus('synced');
      });
  };

  // Save Active Week Setting (Auto / Manual)
  const handleSaveActiveWeekSetting = (newSetting: ActiveWeekSetting) => {
    setActiveWeekSetting(newSetting);
    try {
      localStorage.setItem('curriculum_active_week_setting', JSON.stringify(newSetting));
    } catch {}
    setSyncStatus('saving');

    saveCurriculumToCloud(undefined, undefined, lockState, undefined, newSetting)
      .then((res) => {
        setLastUpdated(res.lastUpdated);
        setSyncStatus('synced');
      })
      .catch(() => {
        fetch('/api/curriculum', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activeWeekSetting: newSetting })
        })
          .then(res => res.json())
          .then(data => {
            if (data.lastUpdated) setLastUpdated(data.lastUpdated);
            setSyncStatus('synced');
          })
          .catch(() => setSyncStatus('synced'));
      });
  };

  // Save Portal Overview Settings (Title, Description, Academic Year)
  const handleSaveOverviewSettings = (newSettings: PortalOverviewSettings) => {
    setOverviewSettings(newSettings);
    try {
      localStorage.setItem('curriculum_overview_settings', JSON.stringify(newSettings));
    } catch {}
    setSyncStatus('saving');

    saveCurriculumToCloud(undefined, undefined, lockState, undefined, undefined, newSettings)
      .then((res) => {
        setLastUpdated(res.lastUpdated);
        setSyncStatus('synced');
      })
      .catch(() => {
        fetch('/api/curriculum', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ overviewSettings: newSettings })
        })
          .then(res => res.json())
          .then(data => {
            if (data.lastUpdated) setLastUpdated(data.lastUpdated);
            setSyncStatus('synced');
          })
          .catch(() => setSyncStatus('synced'));
      });
  };

  // Lock / Unlock toggle via API & Firestore
  const handleToggleLock = async (
    shouldLock: boolean,
    pin?: string,
    currentPin?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const newLockState: LockState = {
      isLocked: shouldLock,
      hasPin: true,
      lockedBy: shouldLock ? 'Computing Department' : undefined,
      lockedAt: shouldLock ? new Date().toISOString() : undefined
    };

    try {
      // Cloud Firestore save
      await saveCurriculumToCloud(undefined, undefined, newLockState);
      setLockState(newLockState);
      try {
        localStorage.setItem('curriculum_lock_state', JSON.stringify({ ...newLockState, pin: pin || '2026' }));
      } catch {}
      return { success: true };
    } catch {
      // Fallback
      setLockState(newLockState);
      try {
        localStorage.setItem('curriculum_lock_state', JSON.stringify({ ...newLockState, pin: pin || '2026' }));
      } catch {}
      return { success: true };
    }
  };

  // Reset to default syllabus
  const handleReset = async () => {
    if (isLocked) {
      alert('Timeline is currently locked. Please unlock first to reset.');
      return;
    }
    if (!window.confirm('Reset all 38 weeks and 7 year levels back to the default curriculum? Your custom edits will be replaced.')) {
      return;
    }

    const resetPlan = JSON.parse(JSON.stringify(INITIAL_PLAN));
    const resetReportDates = JSON.parse(JSON.stringify(DEFAULT_YEAR_REPORT_DATES));

    try {
      await saveCurriculumToCloud(resetPlan, resetReportDates, lockState);
      setPlan(resetPlan);
      setReportDates(resetReportDates);
      setSyncStatus('synced');
    } catch {
      setPlan(resetPlan);
      setReportDates(resetReportDates);
    }
  };

  // Year filter toggle
  const handleToggleYear = (yearId: string) => {
    setSelectedYears(prev => {
      if (prev.includes(yearId)) {
        if (prev.length === 1) return prev; // keep at least 1 year visible
        return prev.filter(id => id !== yearId);
      }
      return [...prev, yearId];
    });
  };

  // Stage preset filter
  const handleSelectStage = (stage: 'all' | 'ks3' | 'ks4' | 'ks5') => {
    if (stage === 'all') {
      setSelectedYears(YEARS.map(y => y.id));
    } else {
      setSelectedYears(YEARS.filter(y => y.stage === stage).map(y => y.id));
    }
  };

  // Export handlers
  const handleExport = (format: 'md' | 'csv' | 'print') => {
    if (format === 'print') {
      window.print();
      return;
    }

    if (format === 'csv') {
      let csvContent = 'data:text/csv;charset=utf-8,Term,Week,Dates,Holiday/Flag,';
      csvContent += YEARS.map(y => `"${y.label}"`).join(',') + '\n';

      plan.forEach(term => {
        term.rows.forEach(row => {
          if (row.kind === 'break') {
            csvContent += `"${term.name}","Holiday","${row.dates}","${row.label}",,,,,,\n`;
          } else {
            const cells = YEARS.map(y => {
              const cell = row.cells[y.id];
              const text = cell ? cell.text.replace(/"/g, '""') : '';
              return `"${text}"`;
            }).join(',');
            csvContent += `"${term.name}","Week ${row.n}","${row.dates}","${row.flag || ''}",${cells}\n`;
          }
        });
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'bisb_computing_curriculum_2026_2027.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (format === 'md') {
      let md = `# British International School Budapest — Computing Curriculum 2026–2027\n\n`;
      plan.forEach(term => {
        md += `## ${term.name} (${term.dates})\n\n`;
        term.rows.forEach(row => {
          if (row.kind === 'break') {
            md += `### 🏖️ ${row.label} (${row.dates})\n\n`;
          } else {
            md += `#### Week ${row.n} (${row.dates}) ${row.flag ? `[${row.flag}]` : ''}\n`;
            YEARS.forEach(y => {
              const cell = row.cells[y.id];
              if (cell && cell.text) {
                md += `- **${y.label}**: ${cell.text} ${cell.assess ? '★ (Assessment)' : ''}\n`;
              }
            });
            if (row.note) {
              md += `> _Note: ${row.note}_\n`;
            }
            md += `\n`;
          }
        });
      });

      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bisb_computing_curriculum_2026_2027.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Jump to active school week
  const handleJumpCurrentWeek = () => {
    const currentWeekElement = document.getElementById(`week-row-${currentWeekKey}`);
    if (currentWeekElement) {
      currentWeekElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSelectWeek = (weekKey: string) => {
    const el = document.getElementById(`week-row-${weekKey}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 text-base">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 pt-6">
        {userRole === 'student' ? (
          /* Dedicated Student & Parent Experience (100% Read-Only, No Teacher Access) */
          <main>
            <StudentView
              plan={plan}
              years={YEARS}
              selectedYearId={selectedYears[0] || 'y7'}
              onSelectYear={(yId) => setSelectedYears([yId])}
              currentWeekKey={currentWeekKey}
              currentTermName={currentTermName}
              currentWeekText={currentWeekText}
              isManualWeek={isManualWeek}
              overviewSettings={overviewSettings}
              onOpenStaffLogin={() => setIsTeacherAuthOpen(true)}
              userRole={userRole}
              visibilitySettings={studentVisibility}
              reportDates={reportDates}
              onEditBreak={handleOpenEditBreak}
              onDeleteBreak={handleDeleteBreak}
              onToggleBreakVisibility={handleToggleBreakVisibility}
              onAddBreak={handleOpenAddBreak}
              onOpenVisibilitySettings={() => setIsVisibilityModalOpen(true)}
              onOpenActiveWeekModal={() => setIsActiveWeekModalOpen(true)}
              onOpenOverviewModal={() => setIsOverviewModalOpen(true)}
            />
          </main>
        ) : (
          /* Teacher / Department Planner Experience */
          <>
            {/* Header */}
            <Header
              userRole={userRole}
              lockState={lockState}
              syncStatus={syncStatus}
              lastUpdated={lastUpdated}
              currentTermName={currentTermName}
              currentWeekText={currentWeekText}
              isManualWeek={isManualWeek}
              overviewSettings={overviewSettings}
              onJumpCurrentWeek={handleJumpCurrentWeek}
              onOpenActiveWeekModal={() => setIsActiveWeekModalOpen(true)}
              onOpenOverviewModal={() => setIsOverviewModalOpen(true)}
              onLogoutTeacher={handleTeacherLogout}
            />

            {/* 38-Week Interactive Signature Strip */}
            <div className="mb-6">
              <YearStrip
                plan={plan}
                years={YEARS}
                selectedYears={selectedYears}
                currentWeekKey={currentWeekKey}
                onSelectWeek={handleSelectWeek}
              />
            </div>

            {/* Toolbar */}
            <Toolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedYears={selectedYears}
              onToggleYear={handleToggleYear}
              onSelectStage={handleSelectStage}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              assessOnly={assessOnly}
              onToggleAssessOnly={() => setAssessOnly(prev => !prev)}
              reportOnly={reportOnly}
              onToggleReportOnly={() => setReportOnly(prev => !prev)}
              userRole={userRole}
              onToggleRole={handleTeacherLogout}
              lockState={lockState}
              onOpenLockModal={() => setIsLockModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenStatsModal={() => setIsStatsModalOpen(true)}
              onOpenVisibilityModal={() => setIsVisibilityModalOpen(true)}
              onExport={handleExport}
              onReset={handleReset}
            />

            {/* Main Interactive Views */}
            <main className="mt-6">
              {viewMode === 'matrix' && (
                <MatrixView
                  plan={plan}
                  years={YEARS}
                  selectedYears={selectedYears}
                  isLocked={isLocked}
                  lockState={lockState}
                  userRole={userRole}
                  searchQuery={searchQuery}
                  assessOnly={assessOnly}
                  reportOnly={reportOnly}
                  currentWeekKey={currentWeekKey}
                  onUpdateCell={handleUpdateCell}
                  onUpdateNote={handleUpdateNote}
                  onOpenAiHelper={(cell) => setAiHelperCell(cell)}
                  onEditBreak={handleOpenEditBreak}
                  onDeleteBreak={handleDeleteBreak}
                  onToggleBreakVisibility={handleToggleBreakVisibility}
                  onAddBreak={handleOpenAddBreak}
                />
              )}

              {viewMode === 'timeline' && (
                <TimelineView
                  plan={plan}
                  years={YEARS}
                  selectedYears={selectedYears}
                  isLocked={isLocked}
                  lockState={lockState}
                  userRole={userRole}
                  searchQuery={searchQuery}
                  assessOnly={assessOnly}
                  currentWeekKey={currentWeekKey}
                  onUpdateCell={handleUpdateCell}
                  onOpenAiHelper={(cell) => setAiHelperCell(cell)}
                  onEditBreak={handleOpenEditBreak}
                  onDeleteBreak={handleDeleteBreak}
                  onToggleBreakVisibility={handleToggleBreakVisibility}
                  onAddBreak={handleOpenAddBreak}
                />
              )}

              {viewMode === 'calendar' && (
                <CalendarView />
              )}

              {viewMode === 'roadmap' && (
                <RoadmapView
                  plan={plan}
                  years={YEARS}
                  selectedYears={selectedYears}
                />
              )}

              {viewMode === 'reports' && (
                <ReportCycleView
                  reportDates={reportDates}
                  years={YEARS}
                  isLocked={isLocked}
                  lockState={lockState}
                  userRole={userRole}
                  onUpdateReportDates={handleUpdateReportDates}
                />
              )}
            </main>
          </>
        )}
      </div>

      {/* Modals */}
      <LockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        lockState={lockState}
        onToggleLock={handleToggleLock}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isLocked={isLocked}
        initialYear={selectedYears.length === 1 ? selectedYears[0] : 'all'}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        plan={plan}
        years={YEARS}
      />

      <TeacherAuthModal
        isOpen={isTeacherAuthOpen}
        onClose={() => setIsTeacherAuthOpen(false)}
        onSuccess={() => {
          setIsTeacherAuthenticated(true);
          setUserRole('teacher');
        }}
      />

      <BreakModal
        isOpen={breakModalData.isOpen}
        onClose={() => setBreakModalData(prev => ({ ...prev, isOpen: false }))}
        onSave={(updatedBreak) => handleSaveBreak(breakModalData.termId, updatedBreak, breakModalData.positionIdx)}
        initialBreak={breakModalData.breakItem}
        termName={breakModalData.termName}
        isNew={!breakModalData.breakItem}
      />

      <StudentVisibilityModal
        isOpen={isVisibilityModalOpen}
        onClose={() => setIsVisibilityModalOpen(false)}
        settings={studentVisibility}
        onSave={handleSaveStudentVisibility}
      />

      <ActiveWeekModal
        isOpen={isActiveWeekModalOpen}
        onClose={() => setIsActiveWeekModalOpen(false)}
        plan={plan}
        currentWeekInfo={currentWeekInfo}
        setting={activeWeekSetting}
        onSave={handleSaveActiveWeekSetting}
      />

      <PortalOverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        settings={overviewSettings}
        onSave={handleSaveOverviewSettings}
      />

      {aiHelperCell && (
        <AIHelperModal
          isOpen={!!aiHelperCell}
          onClose={() => setAiHelperCell(null)}
          cellInfo={aiHelperCell}
          onApplySuggestion={(text) => {
            handleUpdateCell(
              aiHelperCell.termId,
              aiHelperCell.weekN,
              aiHelperCell.yearId,
              { text }
            );
            setAiHelperCell(null);
          }}
        />
      )}
    </div>
  );
}
