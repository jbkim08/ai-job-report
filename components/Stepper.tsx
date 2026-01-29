'use client';

import { motion } from 'framer-motion';
import { Check, Search, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';



interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: '기업 분석', icon: Search },
  { id: 2, label: '이력서 제출', icon: FileText },
  { id: 3, label: '자소서 생성', icon: Sparkles },
];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex justify-between">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#0f172a' : '#ffffff',
                  borderColor: isCompleted || isCurrent ? '#0f172a' : '#e2e8f0',
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300",
                  isCompleted || isCurrent ? "text-white" : "text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <step.icon size={18} />
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                isCurrent ? "text-slate-900" : "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
