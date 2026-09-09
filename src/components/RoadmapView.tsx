import React from 'react';
import { YEARS } from '../data/defaultPlan';
import { Compass, BookOpen, Code, Cpu, Network, Database, ShieldCheck, Award } from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const units = [
    {
      title: 'Key Stage 3 Computing (Years 7–9)',
      stage: 'KS3',
      color: 'bg-slate-500',
      modules: [
        {
          year: 'Year 7',
          topics: [
            'Term 1: Digital Literacy & Safety · Kodu 3D Game World Programming',
            'Term 2: Physical Hardware · BBC micro:bit & Sensors (LED, Accelerometer)',
            'Term 3: Applied Robotics & Control · Line Following & Obstacle Challenge'
          ]
        },
        {
          year: 'Year 8',
          topics: [
            'Term 1: Visual Logic & Game Loops · Scratch 3.0 Interactive Mechanics',
            'Term 2: Modern Web Development · HTML5 & CSS3 Responsive Styling',
            'Term 3: Client Website Production · UX Design & Web Design Showcase'
          ]
        },
        {
          year: 'Year 9',
          topics: [
            'Term 1: Text-based Programming · Python Fundamentals, Iteration & Data Types',
            'Term 2: Mobile App Development · Thunkable UI Design & Event Blocks',
            'Term 3: Networking Fundamentals, Cyber Security & KS4 IGCSE Bridging'
          ]
        }
      ]
    },
    {
      title: 'Pearson Edexcel International GCSE (4CP0)',
      stage: 'KS4 (Years 10–11)',
      color: 'bg-slate-600',
      modules: [
        {
          year: 'Year 10',
          topics: [
            'Term 1: Topic 3 Data Representation (Binary, Hex, Character Sets, Images, Sound, Compression, Encryption)',
            'Term 2: Topic 2 Practical Programming in Python (Selection, Loops, 1D/2D Arrays, File I/O, Subprograms)',
            'Term 3: Topic 1 Algorithms (Trace Tables, Searching, Bubble & Merge Sort) + Topic 6 Impacts of Tech'
          ]
        },
        {
          year: 'Year 11',
          topics: [
            'Term 1: Python Masterclass & Paper 2 Practical timed coding + Topic 4 Computers & CPU Architecture',
            'Term 2: Mock Exam Series (Paper 1 & Paper 2) + Topic 5 Networks & Cyber Defense. Course completed by March!',
            'Term 3: Intensive Past Paper Revision, Model Answers, Study Leave & Official June Exam Series sat.'
          ]
        }
      ]
    },
    {
      title: 'IB Diploma Programme Computer Science (First Exam 2027)',
      stage: 'KS5 (Years 12–13)',
      color: 'bg-slate-700',
      modules: [
        {
          year: 'Year 12',
          topics: [
            'Term 1: Theme B Computational Thinking & Python Programming + OOP (Classes, Inheritance, Polymorphism) + ADTs',
            'Term 2: Theme A3 Relational Databases, SQL & Normalisation + Official IA Computational Solution launch',
            'Term 3: IA Development Sprints 1–3 + End of Year Examination (Paper 1 & 2) + Summer Criterion Targets'
          ]
        },
        {
          year: 'Year 13',
          topics: [
            'Term 1: IA Official Completion & Video Demo + Theme A1 Hardware & Architecture + A2 Networks',
            'Term 2: Theme A4 Machine Learning & Neural Networks + Official 2027 Case Study in-depth dossier analysis + Mocks',
            'Term 3: Final Examination Revision (Themes A1-A4 & B1-B4) + Official IB Diploma May 2027 Exam Session.'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Computing Curriculum Roadmap & Progression
            </h2>
            <p className="text-sm text-slate-600 font-mono-code font-medium">
              Progression pathway from Year 7 Foundations through to IB Diploma Mastery
            </p>
          </div>
        </div>
      </div>

      {/* Pathway Cards */}
      <div className="space-y-6">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <span className={`w-3.5 h-3.5 rounded-full ${unit.color}`} />
              <h3 className="font-display font-bold text-xl text-slate-900">
                {unit.title}
              </h3>
              <span className="ml-auto text-xs font-mono-code font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {unit.stage}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {unit.modules.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 mb-3 pb-2 border-b border-slate-200">
                      {mod.year}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700 font-medium">
                      {mod.topics.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
