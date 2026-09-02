import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Award, CheckCircle2, XCircle, Flame, Sparkles, Star, Zap } from 'lucide-react';
import { QuestionResult } from '../types';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GameOverScreenProps {
  score: number;
  totalPossibleScore: number;
  results: QuestionResult[];
  onRestartGame: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  totalPossibleScore,
  results,
  onRestartGame,
}) => {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const accuracyPercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  // Trigger confetti burst on game over mount
  useEffect(() => {
    soundFx.playVictory();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundFx.playClick();
        onRestartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestartGame]);

  // Determine Grade Badge & Stars
  let gradeTitle = 'Vocabulary Master!';
  let gradeMessage = 'สุดยอดมาก! คลังคำศัพท์ของคุณยอดเยี่ยมไร้ที่ติ';
  let stars = 3;

  if (accuracyPercent >= 80) {
    gradeTitle = '🌟 Vocabulary Master';
    gradeMessage = 'ยอดเยี่ยมมาก! คุณทำคะแนนได้ในระดับสูงมาก';
    stars = 3;
  } else if (accuracyPercent >= 50) {
    gradeTitle = '⚡ Word Explorer';
    gradeMessage = 'เก่งมาก! พัฒนาคำศัพท์ได้ดีขึ้นเรื่อยๆ';
    stars = 2;
  } else {
    gradeTitle = '🌱 Word Learner';
    gradeMessage = 'เริ่มต้นได้ดี! ลองเล่นซ้ำอีกรอบเพื่อฝึกความจำให้แม่นยำ';
    stars = 1;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center animate-fadeIn">
      {/* Trophy Badge */}
      <div className="relative mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 ring-4 ring-yellow-300/40 animate-bounce">
          <Trophy className="w-14 h-14 text-slate-950 fill-slate-950" />
        </div>
        <div className="absolute -bottom-2 inset-x-0 flex justify-center gap-1">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-6 h-6 ${
                idx < stars
                  ? 'text-yellow-300 fill-yellow-300 drop-shadow-md'
                  : 'text-slate-600 fill-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Announcement */}
      <h2 className="text-3xl sm:text-5xl font-black font-['Fredoka'] text-white tracking-tight mt-4">
        จบเกมแล้ว! (Game Complete)
      </h2>
      <p className="text-base sm:text-lg text-amber-300 font-semibold mt-1">
        {gradeTitle} — {gradeMessage}
      </p>

      {/* Score Showcase Card */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 mt-6 shadow-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          {/* Total Score */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              คะแนนรวมทั้งหมด
            </span>
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-['Fredoka'] mt-1">
              {score}
            </span>
            <span className="text-xs text-slate-400">จากสูงสุด {totalPossibleScore}</span>
          </div>

          {/* Accuracy */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              ความแม่นยำ
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-['Fredoka'] mt-1">
              {accuracyPercent}%
            </span>
            <span className="text-xs text-slate-400">
              ถูก {correctCount} จาก {totalCount} ข้อ
            </span>
          </div>

          {/* Correct Count */}
          <div className="col-span-2 sm:col-span-1 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              สถานะผลลัพธ์
            </span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-300 font-['Fredoka'] mt-1">
              {correctCount === totalCount ? 'PERFECT! 💯' : `${correctCount}/${totalCount} ข้อ`}
            </span>
            <span className="text-xs text-slate-400">เล่นครบทุกโหมด</span>
          </div>
        </div>

        {/* Question-by-question review list */}
        <div className="mt-6 pt-6 border-t border-slate-700/80">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 text-left">
            สรุปผลการตอบแต่ละข้อ:
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {results.map((res, index) => (
              <div
                key={res.questionId + index}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                  res.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {res.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div className="text-left">
                    <span className="font-bold text-white">ข้อ {index + 1}: </span>
                    <span>{res.questionTitle}</span>
                  </div>
                </div>
                <span className="font-mono font-bold shrink-0">
                  {res.isCorrect ? '+10 คะแนน' : '+0 คะแนน'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restart Game Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
        <button
          id="btn-restart-game"
          onClick={() => {
            soundFx.playClick();
            onRestartGame();
          }}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xl font-['Fredoka'] shadow-2xl shadow-emerald-500/40 border-2 border-emerald-300 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-6 h-6 stroke-[3]" />
          <span>RESTART GAME (เริ่มเกมใหม่)</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        <span>เคล็ดลับ: กดปุ่ม </span>
        <kbd className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 font-mono text-yellow-300">
          Enter ↵
        </kbd>
        <span> เพื่อเริ่มเล่นใหม่ได้ทันที</span>
      </div>
    </div>
  );
};
