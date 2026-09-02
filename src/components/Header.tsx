import React from 'react';
import { Volume2, VolumeX, HelpCircle, RotateCcw, Flame, Trophy, Clock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  totalTimeLimit: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onRestart: () => void;
  isPlaying: boolean;
  scoreGainedAnimation: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  totalTimeLimit,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onRestart,
  isPlaying,
  scoreGainedAnimation,
}) => {
  const timePercent = totalTimeLimit > 0 ? (timeRemaining / totalTimeLimit) * 100 : 0;
  const isTimeLow = timeRemaining <= 5 && isPlaying;

  return (
    <header className="w-full bg-slate-800/90 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-40 px-4 py-3 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-xl ring-2 ring-indigo-400/30 font-['Fredoka']">
            W
          </div>
          <div>
            <h1 className="font-['Fredoka'] text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
              Word & Drag Challenge
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              เกมฝึกคำศัพท์ภาษาอังกฤษแบบอินเตอร์แอคทีฟ
            </p>
          </div>
        </div>

        {/* Live Game Stats (When Playing) */}
        {isPlaying && (
          <div className="flex items-center gap-3 sm:gap-5 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-center bg-slate-900/60 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg border sm:border-0 border-slate-700/60">
            {/* Question Counter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">ข้อที่:</span>
              <span className="text-sm sm:text-base font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${isTimeLow ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base font-bold font-mono ${isTimeLow ? 'text-rose-400 animate-bounce' : 'text-amber-300'}`}>
                  {timeRemaining}s
                </span>
              </div>
            </div>

            {/* Score with +10 Pop Animation */}
            <div className="relative flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-300/80 font-medium">คะแนน:</span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-['Fredoka']">
                {score}
              </span>

              {/* Floating +10 popup */}
              {scoreGainedAnimation !== null && (
                <span className="absolute -top-4 right-1 text-xs font-black text-emerald-400 bg-emerald-950 border border-emerald-500 px-1.5 py-0.5 rounded-full animate-bounce shadow-md">
                  +{scoreGainedAnimation}
                </span>
              )}
            </div>

            {/* Streak if > 1 */}
            {streak > 1 && (
              <div className="flex items-center gap-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                <span>{streak}x Streak</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 order-2 sm:order-3">
          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle"
            onClick={() => {
              soundFx.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600 transition hover:scale-105 active:scale-95"
            title={soundEnabled ? 'ปิดเสียง (Mute)' : 'เปิดเสียง (Sound on)'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* How to Play */}
          <button
            id="btn-how-to-play"
            onClick={() => {
              soundFx.playClick();
              onOpenHelp();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs sm:text-sm font-medium transition hover:scale-105 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">วิธีเล่น</span>
          </button>

          {/* Restart Game Button */}
          {isPlaying && (
            <button
              id="btn-header-restart"
              onClick={() => {
                soundFx.playClick();
                onRestart();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-200 border border-rose-500/30 text-xs sm:text-sm font-medium transition hover:scale-105 active:scale-95"
              title="เริ่มเกมใหม่"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar under header when playing */}
      {isPlaying && (
        <div className="w-full bg-slate-700/50 h-1.5 mt-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isTimeLow
                ? 'bg-rose-500 animate-pulse'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
            }`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
