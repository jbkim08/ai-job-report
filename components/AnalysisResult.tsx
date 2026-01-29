'use client';

import { motion } from 'framer-motion';
import { Target, Lightbulb, Users, Key } from 'lucide-react';
import type { JobAnalysis } from '@/app/actions/analyze-job';

interface AnalysisResultProps {
  analysis: JobAnalysis;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const sections = [
    { title: '주요 업무', icon: Target, data: analysis.jobDescription, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: '필수 역량', icon: Lightbulb, data: analysis.requiredSkills, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: '인재상', icon: Users, data: analysis.talentType, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: '핵심 키워드', icon: Key, data: analysis.keywords, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8">
      {sections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white border text-left rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${section.bg} ${section.color}`}>
              <section.icon size={20} />
            </div>
            <h3 className="font-bold text-lg">{section.title}</h3>
          </div>
          <ul className="space-y-2">
            {section.data.map((item, i) => (
              <li key={i} className="text-slate-600 leading-relaxed flex items-start gap-2 text-sm">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
