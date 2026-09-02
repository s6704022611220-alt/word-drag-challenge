import React, { useState, useEffect } from 'react';
import { KeyboardChoiceQuestionData } from '../types';
import { Volume2, CheckCircle2, XCircle, ArrowRight, ArrowLeft, ArrowRightLeft, Sparkles, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface KeyboardChoiceQuestionProps {
  question: KeyboardChoiceQuestionData;
  onAnswerComplete: (isCorrect: boolean, scoreEarned: number, feedback: string) => void;
  onScoreGained: (points: number) => void;
  onNextQuestion: () => void;
  isAnswered: boolean;
}

export const KeyboardChoiceQuestion: React.FC<KeyboardChoiceQuestionProps> = ({
  question,
  onAnswerComplete,
  onScoreGained,
  onNextQuestion,
  isAnswered,
}) => {
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset when question changes
  useEffect(() => {
    setSelectedSide(null);
    setHasSubmitted(false);
  }, [question]);

  const handleSelect = (side: 'left' | 'right') => {
    if (hasSubmitted || isAnswered) return;

    const chosenOption = side === 'left' ? question.leftOption : question.rightOption;
    setSelectedSide(side);
    setHasSubmitted(true);

    if (chosenOption.isCorrect) {
      soundFx.playCorrect();
      soundFx.speak(chosenOption.text);
      onScoreGained(10);
      onAnswerComplete(true, 10, `ถูกต้อง! "${chosenOption.text}" (+10 คะแนน)`);
    } else {
      soundFx.playWrong();
      onAnswerComplete(false, 0, `ยังไม่ถูกต้อง ตัวเลือกที่ถูกต้องคือ "${question.leftOption.isCorrect ? question.leftOption.text : question.rightOption.text}"`);
    }
  };

  // Keyboard Event Listener for ArrowLeft & ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasSubmitted || isAnswered) {
        // If already submitted, pressing Enter can advance to Next Question
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          soundFx.playClick();
          onNextQuestion();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        soundFx.playClick();
        handleSelect('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        soundFx.playClick();
        handleSelect('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSubmitted, isAnswered, question, onNextQuestion]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Arrow Keys Challenge
          </span>
          <span className="text-xs text-slate-400 font-medium">{question.category}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Fredoka'] mt-1">
          {question.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-1">{question.instruction}</p>
      </div>

      {/* Target Word Display */}
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-amber-400 to-purple-500" />

        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          คำศัพท์เป้าหมาย (Target Word)
        </span>

        <div className="flex items-center justify-center gap-3 mb-2">
          <h3 className="text-3xl sm:text-5xl font-black text-amber-400 font-['Fredoka'] tracking-wider">
            {question.promptWord}
          </h3>
          <button
            type="button"
            id="btn-speak-prompt-word"
            onClick={() => soundFx.speak(question.promptWord)}
            className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 transition hover:scale-105 active:scale-95"
            title="ฟังเสียงอ่านคำศัพท์"
            aria-label={`Listen to ${question.promptWord}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-base sm:text-lg text-slate-300 font-medium">
          ความหมาย: <span className="text-white font-semibold">"{question.thaiMeaning}"</span>
        </p>

        <div className="mt-4 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-amber-200/90 font-medium">
          🎯 {question.context}
        </div>
      </div>

      {/* 2 Big Choice Buttons (Left vs Right) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Option */}
        <button
          id="btn-arrow-left-option"
          type="button"
          disabled={hasSubmitted}
          onClick={() => handleSelect('left')}
          className={`p-6 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer relative ${
            hasSubmitted
              ? question.leftOption.isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 ring-4 ring-emerald-500/30'
                : selectedSide === 'left'
                ? 'bg-rose-950/80 border-rose-500 ring-4 ring-rose-500/30'
                : 'bg-slate-800/40 border-slate-700/40 opacity-50'
              : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 hover:border-indigo-400 shadow-xl'
          }`}
        >
          {/* Key Badge */}
          <div className="flex items-center justify-between w-full mb-3">
            <span className="px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ปุ่ม [← ลูกศรซ้าย]</span>
            </span>

            {hasSubmitted && question.leftOption.isCorrect && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
            {hasSubmitted && selectedSide === 'left' && !question.leftOption.isCorrect && (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}
          </div>

          <div>
            <h4 className="text-xl sm:text-2xl font-black text-white font-['Fredoka'] mb-1">
              {question.leftOption.text}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {question.leftOption.thai}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-medium">
            กดปุ่มลูกศรซ้ายหรือคลิกที่นี่
          </div>
        </button>

        {/* Right Option */}
        <button
          id="btn-arrow-right-option"
          type="button"
          disabled={hasSubmitted}
          onClick={() => handleSelect('right')}
          className={`p-6 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer relative ${
            hasSubmitted
              ? question.rightOption.isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 ring-4 ring-emerald-500/30'
                : selectedSide === 'right'
                ? 'bg-rose-950/80 border-rose-500 ring-4 ring-rose-500/30'
                : 'bg-slate-800/40 border-slate-700/40 opacity-50'
              : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 hover:border-indigo-400 shadow-xl'
          }`}
        >
          {/* Key Badge */}
          <div className="flex items-center justify-between w-full mb-3">
            <span className="px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span>ปุ่ม [ลูกศรขวา →]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>

            {hasSubmitted && question.rightOption.isCorrect && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            )}
            {hasSubmitted && selectedSide === 'right' && !question.rightOption.isCorrect && (
              <XCircle className="w-6 h-6 text-rose-400" />
            )}
          </div>

          <div>
            <h4 className="text-xl sm:text-2xl font-black text-white font-['Fredoka'] mb-1">
              {question.rightOption.text}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {question.rightOption.thai}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-medium">
            กดปุ่มลูกศรขวาหรือคลิกที่นี่
          </div>
        </button>
      </div>

      {/* Answer Explanation & Next Question Button */}
      {hasSubmitted && (
        <div className="bg-slate-800/95 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                คำอธิบาย (Explanation)
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {question.explanation}
            </p>
          </div>

          <button
            id="btn-next-question"
            onClick={() => {
              soundFx.playClick();
              onNextQuestion();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg font-['Fredoka'] shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span>NEXT QUESTION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
