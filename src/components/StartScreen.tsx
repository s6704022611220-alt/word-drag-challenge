import React, { useEffect } from 'react';
import { Play, Sparkles, MoveRight, HelpCircle, Layers, Type, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StartScreenProps {
  onStartGame: () => void;
  onOpenHelp: () => void;
  totalQuestions: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenHelp,
  totalQuestions,
}) => {
  // Listen to Enter/Space to start game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        soundFx.playClick();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-fadeIn">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>เกมฝึกคำศัพท์ภาษาอังกฤษแบบโต้ตอบครบทุกมิติ</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black font-['Fredoka'] tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent leading-none mb-4">
        Word & Drag Challenge
      </h1>
      <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-light mb-8 leading-relaxed">
        ท้าทายคลังคำศัพท์ภาษาอังกฤษของคุณด้วยระบบ <span className="text-indigo-400 font-semibold">ลากและวาง</span>, <span className="text-pink-400 font-semibold">พิมพ์ตอบด้วยคีย์บอร์ด</span>, และ <span className="text-amber-400 font-semibold">เลือกด้วยปุ่มลูกศร [←] [→]</span>
      </p>

      {/* 3 Game Interaction Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 text-left">
        {/* Card 1 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-purple-500/50 transition duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3.5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Fredoka']">1. Drag & Drop</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              ลากการ์ดคำศัพท์ไปวางในกล่องหมวดหมู่ที่ถูกต้อง ตอบถูกรับ +10 คะแนน ตอบผิดมีแจ้งเตือน
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-purple-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-purple-400" /> รองรับทั้งเมาส์และทัชสกรีน
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-indigo-500/50 transition duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3.5">
              <Type className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Fredoka']">2. Typing & Enter</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              พิมพ์คำศัพท์ตามคำใบ้และประโยคตัวอย่าง แล้วกดปุ่ม Enter ↵ บนคีย์บอร์ดเพื่อส่งคำตอบ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> ฝึกการสะกดคำแม่นยำ
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-500/50 transition duration-300 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3.5">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white font-['Fredoka']">3. Arrow Keys</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              กดปุ่มลูกศรซ้าย [←] หรือ ขวา [→] บนคีย์บอร์ด เพื่อเลือกคำศัพท์หรือคำเหมือน/ตรงข้าม
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-amber-400" /> ทดสอบความไวและการตัดสินใจ
          </div>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-6">
        {/* Start Game Button */}
        <button
          id="btn-start-game"
          onClick={() => {
            soundFx.playClick();
            onStartGame();
          }}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xl font-['Fredoka'] shadow-xl shadow-emerald-500/30 border-2 border-emerald-300 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 group cursor-pointer"
        >
          <Play className="w-7 h-7 fill-slate-950 transition-transform group-hover:scale-110" />
          <span>START GAME (เริ่มเกม)</span>
        </button>

        {/* How to play button */}
        <button
          id="btn-start-screen-help"
          onClick={() => {
            soundFx.playClick();
            onOpenHelp();
          }}
          className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>วิธีเล่น</span>
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3.5 py-1.5 rounded-full border border-slate-700/40">
        <span>เคล็ดลับ: กดปุ่ม</span>
        <kbd className="px-2 py-0.5 rounded bg-slate-700 font-mono text-yellow-300 font-bold border border-slate-600">
          Enter ↵
        </kbd>
        <span>หรือ</span>
        <kbd className="px-2 py-0.5 rounded bg-slate-700 font-mono text-yellow-300 font-bold border border-slate-600">
          Spacebar
        </kbd>
        <span>เพื่อเริ่มเกมได้ทันที!</span>
      </div>

      {/* Info Stats */}
      <div className="mt-8 text-xs text-slate-500 flex items-center gap-4">
        <span>🎮 ทั้งหมด {totalQuestions} ข้อท้าทาย</span>
        <span>•</span>
        <span>⚡ ข้อละ +10 คะแนน</span>
        <span>•</span>
        <span>🔊 มีเสียงพากย์คำศัพท์</span>
      </div>
    </div>
  );
};
