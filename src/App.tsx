import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Question, QuestionResult } from './types';
import { GAME_QUESTIONS } from './data/questions';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { DragDropQuestion } from './components/DragDropQuestion';
import { TypingQuestion } from './components/TypingQuestion';
import { KeyboardChoiceQuestion } from './components/KeyboardChoiceQuestion';
import { GameOverScreen } from './components/GameOverScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [questions] = useState<Question[]>(GAME_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [totalTimeLimit, setTotalTimeLimit] = useState(30);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scoreGainedAnimation, setScoreGainedAnimation] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound settings
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundFx.enabled = next;
      return next;
    });
  };

  // Add score with animation
  const handleScoreGained = (points: number) => {
    setScore((prev) => prev + points);
    setScoreGainedAnimation(points);
    setTimeout(() => {
      setScoreGainedAnimation(null);
    }, 1200);
  };

  // Start game from beginning
  const handleStartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setResults([]);
    setIsAnswered(false);

    const firstQ = questions[0];
    const initialTime = firstQ.timeLimitSeconds || 35;
    setTimeRemaining(initialTime);
    setTotalTimeLimit(initialTime);
    setGameStatus('playing');
  };

  // Restart game
  const handleRestartGame = () => {
    handleStartGame();
  };

  // Handle completing current question
  const handleAnswerComplete = useCallback(
    (isCorrect: boolean, scoreEarned: number, feedback: string) => {
      setIsAnswered(true);

      // Update streak
      if (isCorrect) {
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }

      // Record result
      const timeSpent = totalTimeLimit - timeRemaining;
      const newResult: QuestionResult = {
        questionId: currentQuestion.id,
        questionTitle: currentQuestion.title,
        type: currentQuestion.type,
        isCorrect,
        userScoreEarned: scoreEarned,
        timeSpentSeconds: Math.max(1, timeSpent),
        userFeedback: feedback,
      };

      setResults((prev) => [...prev, newResult]);
    },
    [currentQuestion, totalTimeLimit, timeRemaining]
  );

  // Advance to Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIdx = currentQuestionIndex + 1;
      const nextQ = questions[nextIdx];
      setCurrentQuestionIndex(nextIdx);
      setIsAnswered(false);
      const nextTime = nextQ.timeLimitSeconds || 35;
      setTimeRemaining(nextTime);
      setTotalTimeLimit(nextTime);
      setGameStatus('playing');
    } else {
      // Game Over
      setGameStatus('game_over');
    }
  };

  // Timer Tick
  useEffect(() => {
    if (gameStatus !== 'playing' || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Time's up!
          soundFx.playWrong();
          handleAnswerComplete(false, 0, 'หมดเวลาสำหรับข้อนี้!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, isAnswered, handleAnswerComplete]);

  const totalPossibleScore = questions.length * 10;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header
        score={score}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        totalTimeLimit={totalTimeLimit}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
        onRestart={handleRestartGame}
        isPlaying={gameStatus === 'playing'}
        scoreGainedAnimation={scoreGainedAnimation}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center py-4 sm:py-8">
        {/* 1. Start Screen */}
        {gameStatus === 'idle' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenHelp={() => setIsHelpOpen(true)}
            totalQuestions={questions.length}
          />
        )}

        {/* 2. Active Question Playing Screen */}
        {gameStatus === 'playing' && currentQuestion && (
          <div className="w-full">
            {currentQuestion.type === 'drag_drop' && (
              <DragDropQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerComplete={handleAnswerComplete}
                onScoreGained={handleScoreGained}
                onNextQuestion={handleNextQuestion}
                isAnswered={isAnswered}
              />
            )}

            {currentQuestion.type === 'typing' && (
              <TypingQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerComplete={handleAnswerComplete}
                onScoreGained={handleScoreGained}
                onNextQuestion={handleNextQuestion}
                isAnswered={isAnswered}
              />
            )}

            {currentQuestion.type === 'keyboard_arrows' && (
              <KeyboardChoiceQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswerComplete={handleAnswerComplete}
                onScoreGained={handleScoreGained}
                onNextQuestion={handleNextQuestion}
                isAnswered={isAnswered}
              />
            )}
          </div>
        )}

        {/* 3. Game Over Screen */}
        {gameStatus === 'game_over' && (
          <GameOverScreen
            score={score}
            totalPossibleScore={totalPossibleScore}
            results={results}
            onRestartGame={handleRestartGame}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full py-4 border-t border-slate-800 bg-slate-950/60 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Word & Drag Challenge • เกมฝึกคำศัพท์ภาษาอังกฤษ</span>
          <div className="flex items-center gap-4">
            <span>🖱️ ลากและวาง</span>
            <span>⌨️ แป้นพิมพ์ & Enter</span>
            <span>⬅️ ➡️ ปุ่มลูกศร</span>
          </div>
        </div>
      </footer>

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
