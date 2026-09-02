import React, { useState, useEffect, useRef } from 'react';
import { DragDropQuestionData, DragItem, CategoryDropZone } from '../types';
import { Volume2, AlertCircle, CheckCircle2, ArrowRight, Grab, Sparkles, Layers } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DragDropQuestionProps {
  question: DragDropQuestionData;
  onAnswerComplete: (isCorrect: boolean, scoreEarned: number, feedback: string) => void;
  onScoreGained: (points: number) => void;
  onNextQuestion: () => void;
  isAnswered: boolean;
}

export const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  question,
  onAnswerComplete,
  onScoreGained,
  onNextQuestion,
  isAnswered,
}) => {
  // Available items in the pool
  const [unplacedItems, setUnplacedItems] = useState<DragItem[]>(question.items);
  // Placed items categorized: { [categoryId]: DragItem[] }
  const [categorizedItems, setCategorizedItems] = useState<Record<string, DragItem[]>>(() => {
    const initial: Record<string, DragItem[]> = {};
    question.categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    return initial;
  });

  // Selected item (for click-to-place accessibility on touch/keyboard)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Dragging state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  // Alert message for wrong drops
  const [alertMessage, setAlertMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Mobile touch dragging reference
  const touchDragRef = useRef<{
    itemId: string | null;
    ghostEl: HTMLElement | null;
    startX: number;
    startY: number;
  }>({
    itemId: null,
    ghostEl: null,
    startX: 0,
    startY: 0,
  });

  // Reset when question changes
  useEffect(() => {
    setUnplacedItems(question.items);
    const initial: Record<string, DragItem[]> = {};
    question.categories.forEach((cat) => {
      initial[cat.id] = [];
    });
    setCategorizedItems(initial);
    setSelectedItemId(null);
    setDraggedItemId(null);
    setAlertMessage(null);
  }, [question]);

  // Handle Drop into Category
  const handleDropItem = (itemId: string, categoryId: string) => {
    if (isAnswered) return;

    const item = question.items.find((i) => i.id === itemId);
    const category = question.categories.find((c) => c.id === categoryId);

    if (!item || !category) return;

    // Check if correct category
    if (item.targetCategoryId === categoryId) {
      // Correct!
      soundFx.playCorrect();
      soundFx.speak(item.text);

      // Award points
      onScoreGained(10);

      // Move item
      setUnplacedItems((prev) => prev.filter((i) => i.id !== itemId));
      setCategorizedItems((prev) => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), item],
      }));
      setSelectedItemId(null);
      setAlertMessage({
        text: `✨ ยอดเยี่ยม! "${item.text}" (${item.thai}) อยู่ในหมวด ${category.name} (+10 คะแนน)`,
        isError: false,
      });

      // Check if all items are now placed
      const remainingCount = unplacedItems.filter((i) => i.id !== itemId).length;
      if (remainingCount === 0) {
        // Completed this whole question
        soundFx.playVictory();
        onAnswerComplete(true, 10, 'จัดหมวดหมู่คำศัพท์ถูกต้องครบถ้วน!');
      }
    } else {
      // Incorrect placement
      soundFx.playWrong();
      setAlertMessage({
        text: `❌ คำว่า "${item.text}" (${item.thai}) ไม่ได้อยู่ในหมวด "${category.name}"! กรุณาลองใหม่อีกครั้ง`,
        isError: true,
      });
    }

    setDraggedItemId(null);
    setActiveDropZone(null);
  };

  // HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    if (isAnswered) return;
    setDraggedItemId(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    soundFx.playPop();
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropZone !== categoryId) {
      setActiveDropZone(categoryId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (activeDropZone === categoryId) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      handleDropItem(itemId, categoryId);
    }
  };

  // Mobile Touch Support
  const handleTouchStart = (e: React.TouchEvent, item: DragItem) => {
    if (isAnswered) return;
    const touch = e.touches[0];
    touchDragRef.current = {
      itemId: item.id,
      ghostEl: null,
      startX: touch.clientX,
      startY: touch.clientY,
    };
    setSelectedItemId(item.id);
    soundFx.playPop();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const itemId = touchDragRef.current.itemId;
    if (!itemId) return;

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = dropTarget?.closest('[data-category-id]');

    if (dropZone) {
      const categoryId = dropZone.getAttribute('data-category-id');
      if (categoryId) {
        handleDropItem(itemId, categoryId);
      }
    }

    touchDragRef.current.itemId = null;
    setActiveDropZone(null);
  };

  const isCompleted = unplacedItems.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 animate-fadeIn">
      {/* Question Header Card */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Drag & Drop Challenge
            </span>
            <span className="text-xs text-slate-400 font-medium">{question.category}</span>
          </div>

          <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            เหลือ {unplacedItems.length} คำศัพท์
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Fredoka'] mt-1">
          {question.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-1">{question.instruction}</p>
      </div>

      {/* Alert Notification for Drop feedback */}
      {alertMessage && (
        <div
          id="drop-alert-banner"
          className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-300 animate-bounce shadow-lg ${
            alertMessage.isError
              ? 'bg-rose-950/80 border-rose-500/80 text-rose-200'
              : 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
          }`}
        >
          {alertMessage.isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm sm:text-base font-medium">{alertMessage.text}</span>
        </div>
      )}

      {/* Available Word Cards Pool */}
      <div className="bg-slate-800/60 border border-dashed border-slate-600/80 rounded-2xl p-5 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Grab className="w-4 h-4 text-indigo-400" />
            คำศัพท์ที่ต้องลาก (ลากหรือแตะการ์ดแล้วแตะหมวดหมู่):
          </span>
          {selectedItemId && (
            <span className="text-xs text-amber-300 animate-pulse font-medium">
              👉 แตะที่กล่องหมวดหมู่ด้านล่างเพื่อวางคำศัพท์
            </span>
          )}
        </div>

        {unplacedItems.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const isDragging = draggedItemId === item.id;

              return (
                <div
                  key={item.id}
                  id={`drag-item-${item.id}`}
                  draggable={!isAnswered}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => setDraggedItemId(null)}
                  onTouchStart={(e) => handleTouchStart(e, item)}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => {
                    if (isAnswered) return;
                    soundFx.playPop();
                    soundFx.speak(item.text);
                    setSelectedItemId(isSelected ? null : item.id);
                  }}
                  className={`group relative select-none cursor-grab active:cursor-grabbing px-4 py-3 rounded-xl border-2 transition-all duration-200 transform ${
                    isSelected
                      ? 'bg-indigo-600 border-amber-400 text-white scale-105 shadow-lg shadow-indigo-500/30 ring-4 ring-amber-400/40'
                      : isDragging
                      ? 'opacity-40 scale-95 border-dashed border-slate-400'
                      : 'bg-slate-700 hover:bg-slate-650 border-slate-600 hover:border-indigo-400 text-white hover:scale-105 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base sm:text-lg font-['Fredoka'] tracking-wide">
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.speak(item.text);
                      }}
                      className="p-1 rounded-md bg-black/20 hover:bg-black/40 text-slate-300 hover:text-white transition"
                      title="ฟังเสียงอ่าน"
                      aria-label={`Listen to ${item.text}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-300 block font-normal mt-0.5">
                    ({item.thai})
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-emerald-400 font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>จัดหมวดหมู่คำศัพท์ครบทุกคำแล้ว! ยอดเยี่ยมมาก 🎉</span>
          </div>
        )}
      </div>

      {/* Drop Target Categories */}
      <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(question.categories.length, 3)} gap-4`}>
        {question.categories.map((cat) => {
          const placedInThisCat = categorizedItems[cat.id] || [];
          const isTargeted = activeDropZone === cat.id;

          return (
            <div
              key={cat.id}
              data-category-id={cat.id}
              id={`drop-zone-${cat.id}`}
              onDragOver={(e) => handleDragOver(e, cat.id)}
              onDragLeave={(e) => handleDragLeave(e, cat.id)}
              onDrop={(e) => handleDrop(e, cat.id)}
              onClick={() => {
                if (selectedItemId) {
                  handleDropItem(selectedItemId, cat.id);
                }
              }}
              className={`rounded-2xl border-2 p-5 min-h-[190px] flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isTargeted
                  ? 'bg-indigo-900/50 border-indigo-400 ring-4 ring-indigo-400/40 scale-[1.02]'
                  : `${cat.bgColor} ${cat.borderColor} shadow-lg`
              }`}
            >
              {/* Category Title */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <div>
                    <h3 className={`font-bold text-lg font-['Fredoka'] ${cat.color}`}>
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300">{cat.thaiName}</p>
                  </div>
                  <span className="text-xs font-black bg-slate-900/80 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700">
                    {placedInThisCat.length} คำ
                  </span>
                </div>

                {/* Placed Words in this category */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {placedInThisCat.map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm animate-fadeIn"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.text}</span>
                      <span className="text-emerald-400/80 text-xs font-normal">({item.thai})</span>
                    </div>
                  ))}

                  {placedInThisCat.length === 0 && (
                    <div className="py-6 w-full text-center text-xs text-slate-400 border border-dashed border-slate-700/60 rounded-xl">
                      ลากคำศัพท์มาวางที่นี่ หรือแตะเพื่อวาง
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Target Hint */}
              <div className="mt-4 pt-2 text-center text-xs text-slate-400 font-medium">
                {selectedItemId ? '👇 แตะตรงนี้เพื่อวางคำที่เลือก' : '🎯 กล่องรับคำศัพท์'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion & Next Question Button */}
      {isCompleted && (
        <div className="bg-slate-800/90 border border-emerald-500/60 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-emerald-300">
                ทำภารกิจ Drag & Drop สำเร็จ!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">{question.explanation}</p>
            </div>
          </div>

          <button
            id="btn-next-question"
            onClick={() => {
              soundFx.playClick();
              onNextQuestion();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-lg font-['Fredoka'] shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>NEXT QUESTION</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
