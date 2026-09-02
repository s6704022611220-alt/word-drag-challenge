import React, { useState, useEffect, useRef } from 'react';
import { TypingQuestionData } from '../types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, CornerDownLeft, Sparkles, HelpCircle, Lightbulb, Type } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TypingQuestionProps {
  question: TypingQuestionData;
  onAnswerComplete: (isCorrect: boolean, scoreEarned: number, feedback: string) => void;
  onScoreGained: (points: number) => void;
  onNextQuestion: () => void;
  isAnswered: boolean;
}

export const TypingQuestion: React.FC<TypingQuestionProps> = ({
  question,
  onAnswerComplete,
  onScoreGained,
  onNextQuestion,
  isAnswered,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount / question change
  useEffect(() => {
    setInputValue('');
    setHasSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [question]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasSubmitted || isAnswered) return;

    const trimmedInput = inputValue.trim().toLowerCase();
    if (!trimmedInput) return;

    const targetWord = question.word.trim().toLowerCase();
    const acceptable = (question.acceptableAnswers || [question.word]).map((w) =>
      w.trim().toLowerCase()
    );

    const isMatch = trimmedInput === targetWord || acceptable.includes(trimmedInput);

    setHasSubmitted(true);
    setIsCorrect(isMatch);

    if (isMatch) {
      soundFx.playCorrect();
      soundFx.speak(question.word);
      onScoreGained(10);
      onAnswerComplete(true, 10, `ถูกต้อง! "${question.word}" (+10 คะแนน)`);
    } else {
      soundFx.playWrong();
      onAnswerComplete(false, 0, `ยังไม่ถูกต้อง คำตอบที่ถูกต้องคือ "${question.word}"`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Question Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" /> Typing & Spelling Challenge
          </span>
          <span className="text-xs text-slate-400 font-medium">{question.category}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Fredoka'] mt-1">
          {question.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-1">{question.instruction}</p>
      </div>

      {/* Clue and Target Meaning Card */}
      <div className="bg-gradient-to-br from-slate-800/90 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl text-center flex flex-col items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
          ความหมายภาษาไทย (Definition)
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-amber-300 font-['Prompt'] mb-4">
          "{question.thaiMeaning}"
        </h3>

        {/* Example sentence with missing blank */}
        {question.missingSentence && (
          <div className="bg-slate-900/80 border border-slate-700/80 px-4 py-3 rounded-xl max-w-xl text-slate-200 text-sm sm:text-base mb-4 font-mono">
            {question.missingSentence}
          </div>
        )}

        {/* Hint toggle */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-hint"
            type="button"
            onClick={() => {
              soundFx.playPop();
              setShowHint(!showHint);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/40 transition"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>{showHint ? 'ซ่อนคำใบ้' : 'ดูคำใบ้ (Hint)'}</span>
          </button>

          {showHint && (
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg animate-fadeIn">
              💡 {question.hint}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Form & Input Field */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            ref={inputRef}
            id="input-vocabulary-answer"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={hasSubmitted || isAnswered}
            placeholder="พิมพ์คำศัพท์ภาษาอังกฤษที่นี่..."
            autoComplete="off"
            spellCheck="false"
            className={`w-full py-4 sm:py-5 pl-5 pr-36 rounded-2xl text-lg sm:text-2xl font-bold font-mono tracking-wider transition-all duration-200 outline-none ${
              hasSubmitted
                ? isCorrect
                  ? 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-300 ring-4 ring-emerald-500/20'
                  : 'bg-rose-950/50 border-2 border-rose-500 text-rose-300 ring-4 ring-rose-500/20'
                : 'bg-slate-800/90 border-2 border-slate-600 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 text-white shadow-inner'
            }`}
          />

          {/* Submit Button inside input for touch/click */}
          {!hasSubmitted && (
            <button
              id="btn-submit-typing-answer"
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-sm sm:text-base flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>ส่งคำตอบ</span>
              <CornerDownLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Keyboard Enter Hint */}
        {!hasSubmitted && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <span>กดปุ่ม</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 font-mono text-yellow-300 font-bold">
              Enter ↵
            </kbd>
            <span>บนแป้นพิมพ์เพื่อส่งคำตอบได้ทันที</span>
          </div>
        )}
      </form>

      {/* Answer Result Banner */}
      {hasSubmitted && (
        <div
          id="typing-result-card"
          className={`p-6 rounded-2xl border-2 shadow-2xl flex flex-col gap-4 animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/80 text-rose-200'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xl font-bold font-['Fredoka']">
                  {isCorrect ? 'ถูกต้องแล้ว! (+10 คะแนน) 🎉' : 'ยังไม่ถูกต้อง ❌'}
                </h4>
                <div className="mt-1 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                  <span>คำตอบที่ถูกต้องคือ:</span>
                  <span className="font-bold font-mono text-lg text-white bg-black/40 px-3 py-1 rounded-lg border border-white/20">
                    {question.word}
                  </span>
                  <button
                    id="btn-speak-word"
                    type="button"
                    onClick={() => soundFx.speak(question.word)}
                    className="p-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-white border border-indigo-400/40 flex items-center gap-1 text-xs font-semibold"
                    title="ฟังเสียงอ่านภาษาอังกฤษ"
                  >
                    <Volume2 className="w-4 h-4 text-yellow-300" />
                    <span>ฟังเสียง</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-black/30 rounded-xl text-xs sm:text-sm text-slate-200 border border-white/10">
            <span className="font-semibold text-amber-300">คำอธิบายเพิ่มเติม: </span>
            {question.explanation}
          </div>

          {/* Next Question Button */}
          <div className="flex justify-end pt-2">
            <button
              id="btn-next-question"
              onClick={() => {
                soundFx.playClick();
                onNextQuestion();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-base font-['Fredoka'] shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>NEXT QUESTION</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
