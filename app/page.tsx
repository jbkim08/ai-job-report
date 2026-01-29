'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, Upload, Sparkles, Copy, CheckCircle2, Search } from 'lucide-react';
import { Stepper } from '@/components/Stepper';
import { AnalysisResult } from '@/components/AnalysisResult';
import { analyzeJobPost, type JobAnalysis } from '@/app/actions/analyze-job';
import { parseResume } from '@/app/actions/parse-resume';
import { generateContent } from '@/app/actions/generate-content';

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [result, setResult] = useState<{ coverLetter: string; summary: string } | null>(null);

  const handleAnalyze = async () => {
    if (!jobUrl) return alert('채용 공고 URL을 입력해주세요.');
    setLoading(true);
    const res = await analyzeJobPost(jobUrl, companyUrl);
    setLoading(false);
    
    if (res.success && res.data) {
      setAnalysis(res.data);
      setStep(2);
    } else {
      alert(res.error || '분석에 실패했습니다.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('텍스트(.txt) 파일만 업로드할 수 있습니다.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await parseResume(formData);
    setLoading(false);

    if (res.success && res.text) {
      setResumeText(res.text);
      setResumeName(file.name);
      // Optional: Auto advance or let user review
    } else {
      alert(res.error || '이력서 파싱에 실패했습니다.');
    }
  };

  const handleGenerate = async () => {
    if (!analysis || !resumeText) return;
    setLoading(true);
    const res = await generateContent(analysis, resumeText);
    setLoading(false);

    if (res.success && res.data) {
      setResult(res.data);
      setStep(3);
    } else {
      alert(res.error || '생성에 실패했습니다.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다!');
  };

  return (
    <div className="w-full text-center">
      <Stepper currentStep={step} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Step 1: Analysis */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">채용 공고 분석</h2>
              <p className="text-slate-500">지원하려는 공고의 URL을 입력하면 핵심 내용을 분석해드립니다.</p>
            </div>
            
            <div className="space-y-4 text-left p-6 border rounded-xl bg-white shadow-sm">
              <div>
                <label className="block text-sm font-medium mb-1">채용 공고 URL (필수)</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">회사 홈페이지 URL (선택)</label>
                <input
                  type="url"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !jobUrl}
                className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {loading ? '분석 중...' : '분석 시작하기'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Resume */}
        {step === 2 && analysis && (
          <div className="space-y-8">
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">이력서 연결</h2>
              <p className="text-slate-500">분석된 기업 정보에 맞출 귀하의 이력서를 업로드해주세요.</p>
            </div>

            <AnalysisResult analysis={analysis} />

            <div className="mt-8 p-8 border-2 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-full shadow-sm text-slate-900">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{resumeName ? '업로드 완료!' : 'TXT 이력서(한글,워드등 다른 이름으로 저장하기로 변환)'}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {resumeName || '클릭하거나 파일을 드래그하여 업로드하세요 (텍스트 추출용)'}
                  </p>
                </div>
              </div>
            </div>

            {resumeText && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-2 text-sm justify-center">
                <CheckCircle2 size={16} />
                이력서 텍스트 {resumeText.length}자 추출 성공
              </div>
            )}

            <div className="flex gap-3">
               <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                뒤로 가기
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !resumeText}
                className="flex-2 py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? '맞춤 자소서 생성 중...' : '자소서 생성하기'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className="space-y-8 pb-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">생성 완료!</h2>
              <p className="text-slate-500">기업 분석과 이력서를 매칭한 맞춤형 자기소개서입니다.</p>
            </div>

            <div className="bg-white border rounded-xl p-8 shadow-sm text-left whitespace-pre-wrap leading-relaxed">
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  핵심 요약
                </h3>
                <p className="text-slate-600 text-sm">{result.summary}</p>
              </div>
              <div className="prose prose-slate max-w-none">
                {result.coverLetter}
              </div>
            </div>

             <div className="flex gap-3">
               <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                다시 만들기
              </button>
              <button
                onClick={() => copyToClipboard(result.coverLetter)}
                className="flex-2 py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Copy size={20} />
                전체 복사하기
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
