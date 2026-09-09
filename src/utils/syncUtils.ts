import { TermData, YearReportDate } from '../types';

export interface ExportedCurriculumPayload {
  app: string;
  version: number;
  exportedAt: string;
  plan: TermData[];
  reportDates?: YearReportDate[];
  notes?: string;
}

export function exportCurriculumToJSON(plan: TermData[], reportDates: YearReportDate[]) {
  const payload: ExportedCurriculumPayload = {
    app: 'BISB Computing Curriculum Planner 2026–2027',
    version: 2,
    exportedAt: new Date().toISOString(),
    plan,
    reportDates
  };

  const str = JSON.stringify(payload, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bisb-curriculum-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCurriculumFromJSON(
  file: File,
  onSuccess: (plan: TermData[], reportDates?: YearReportDate[]) => void,
  onError: (errMsg: string) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.plan)) {
        onSuccess(parsed.plan, Array.isArray(parsed.reportDates) ? parsed.reportDates : undefined);
      } else {
        onError('Invalid backup file. Could not find valid curriculum plan structure.');
      }
    } catch {
      onError('Failed to parse JSON file.');
    }
  };
  reader.onerror = () => {
    onError('Failed to read file from disk.');
  };
  reader.readAsText(file);
}
