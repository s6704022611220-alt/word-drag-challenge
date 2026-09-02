import React from 'react';
import { X, Play, CornerDownLeft, MoveRight, MoveLeft, Grab, Trophy, Keyboard, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-100">
        {/* Close Button */}
        <button
          id="btn-close-how-to-play"
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka'] text-white">
              คำแนะนำวิธีเล่นเกม (How to Play)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              เรียนรู้คำศัพท์ภาษาอังกฤษผ่านการโต้ตอบ 4 รูปแบบ
            </p>
          </div>
        </div>

        {/* 4 Interaction Sections */}
        <div className="space-y-4 text-sm">
          {/* 1. ปุ่มควบคุม */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
                1. การกดปุ่ม (Buttons)
              </h3>
              <p className="text-slate-300 mt-1">
                มีปุ่มขนาดใหญ่และชัดเจนสำหรับควบคุมเกม ได้แก่ <span className="text-emerald-400 font-semibold">Start Game</span> เพื่อเริ่มเล่น, <span className="text-indigo-400 font-semibold">Next Question</span> เพื่อไปข้อถัดไป, และ <span className="text-rose-400 font-semibold">Restart Game</span> เพื่อเริ่มใหม่ได้ทุกเมื่อ
              </p>
            </div>
          </div>

          {/* 2. การกรอกข้อมูล & Enter */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <CornerDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-300 text-base flex items-center gap-2">
                2. การกรอกข้อมูล (Text Input & Enter)
              </h3>
              <p className="text-slate-300 mt-1">
                ในคำถามประเภทสะกดคำ อ่านคำใบ้/ความหมายภาษาไทย แล้วพิมพ์คำศัพท์ภาษาอังกฤษลงในช่อง และสามารถกดปุ่ม <kbd className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 font-mono text-xs text-yellow-300">Enter ↵</kbd> บนคีย์บอร์ดเพื่อส่งคำตอบได้ทันที
              </p>
            </div>
          </div>

          {/* 3. การลากและวาง Drag and Drop */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Grab className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-purple-300 text-base flex items-center gap-2">
                3. การลากและวาง (Drag & Drop)
              </h3>
              <p className="text-slate-300 mt-1">
                ใช้นิ้วหรือเมาส์ลากการ์ดคำศัพท์ (Word Card) ไปหย่อนลงในกล่องหมวดหมู่ที่ถูกต้อง (รองรับทั้งมือถือและคอมพิวเตอร์)
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-xs text-slate-300">
                <li><span className="text-emerald-400 font-semibold">เมื่อวางถูกต้อง:</span> ได้รับคะแนน +10 คะแนน</li>
                <li><span className="text-rose-400 font-semibold">เมื่อวางผิดหมวดหมู่:</span> ระบบจะแสดงข้อความแจ้งเตือนสีแดงและการ์ดจะเด้งกลับ</li>
              </ul>
            </div>
          </div>

          {/* 4. การใช้คีย์บอร์ด ลูกศรซ้าย/ขวา */}
          <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
                4. การใช้คีย์บอร์ดลูกศร (Arrow Keys ⬅️ / ➡️)
              </h3>
              <p className="text-slate-300 mt-1">
                ในคำถามแบบทดสอบความเร็ว คุณสามารถกดปุ่มลูกศร <kbd className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 font-mono text-xs text-amber-300">← ซ้าย</kbd> หรือ <kbd className="px-2 py-0.5 rounded bg-slate-700 border border-slate-600 font-mono text-xs text-amber-300">ขวา →</kbd> บนคีย์บอร์ดเพื่อเลือกตัวเลือกได้ทันที หรือกดคลิกที่ปุ่มตัวเลือก
              </p>
            </div>
          </div>

          {/* 5. ระบบคะแนน */}
          <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3.5">
            <Trophy className="w-7 h-7 text-yellow-400 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-300">ระบบคะแนน & เวลา</h4>
              <p className="text-xs sm:text-sm text-slate-300">
                คะแนนเริ่มต้น <span className="font-bold text-white">0</span> คะแนน • ตอบถูกต้องรับข้อละ <span className="font-bold text-emerald-400">+10</span> คะแนน • เมื่อเล่นครบทุกข้อจะแสดงคะแนนรวมและบทสรุป
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            id="btn-understand-how-to-play"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            เข้าใจแล้ว พร้อมลุย! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
