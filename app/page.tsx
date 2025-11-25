"use client"
import { useRef, useEffect, useState, useCallback } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { convertLatexToMathMl } from 'mathlive';
import DOMPurify from 'dompurify';

// 問題データ（将来はDBから取得したり、ランダム生成したりします）
const PROBLEMS = [
  { id: 1, answer: 'x^2', description: 'xの2乗' },
  { id: 2, answer: '\\frac{1}{2}', description: '2分の1（分数）' },
  { id: 3, answer: '\\sqrt{x}', description: 'xのルート（平方根）' },
  { id: 4, answer: '\\sum_{i=1}^{n} i', description: 'i=1からnまでの総和' },
  { id: 5, answer: '\\prod_{i=1}^{n} i', description: 'i=1からnまでの総積' },
];

const MAXTEXTSIZE:number = 50;

export default function TeXGame() {
  // ゲームの状態管理
  const [problemId, setProblemId] = useState<number>(0); // 現在の問題番号
  const [input, setInput] = useState<string>(''); // ユーザーの入力
  const [score, setScore] = useState<number>(0); // スコア
  const [feedback, setFeedback] = useState<string>(''); // 正解・不正解のメッセージ
  const [isCorrect, setIsCorrect] = useState<boolean>(false); // クリア状態

  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblem = PROBLEMS[problemId];

  // 文字列正規化ロジック（スペースを削除して判定を緩くする）
  const normalize = (str:string) => str.replace(/\s/g, '');

  // 入力チェック関数
  const checkAnswer = (userInput:string) => {
    if(isCorrect)return;
    let copyUserInput:string = userInput;
    if(copyUserInput.length > MAXTEXTSIZE){
      copyUserInput = copyUserInput.substring(0,MAXTEXTSIZE);
    }
    setInput(copyUserInput);
    
    if (!currentProblem) return;

    // 入力が空の場合は何もしない
    if (userInput.trim() === '') {
      setFeedback('');
      return;
    }

    const previewResult = renderMath(userInput);
    if (previewResult.hasError) {
      setFeedback('');
      return;
    }

    const userMathML = convertLatexToMathMl(normalize(userInput));
    const correctMathML = convertLatexToMathMl(normalize(currentProblem.answer));

    // 判定ロジック
    if (userMathML === correctMathML) {
      setFeedback('Correct! 🎉');
      setIsCorrect(true);
    } else {
      setFeedback('');
    }
  };

  // 次の問題へ進む
  const handleNext = useCallback(() => {
    if (problemId < PROBLEMS.length - 1) {
      setProblemId(problemId + 1);
      setInput('');
      setFeedback('');
      setIsCorrect(false);
      setScore(score + 100);
    } else {
      setFeedback('Game Clear! 全問正解です！ 🏆');
      setIsCorrect(false); // ボタンを無効化して終了
    }
  }, [problemId, score]);

  // 正解時に自動で次の問題へ遷移
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        handleNext();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isCorrect, handleNext]);

  // KaTeXを使ってHTML文字列を生成するヘルパー関数
  const renderMath = (tex:string) => {
    if(tex.length >= MAXTEXTSIZE)return { __html: '<span style="color:red">Too many characters</span>' };

    try {
      const html = katex.renderToString(tex, { 
        throwOnError: false
      });

      if (html.includes('katex-error')) {
        const sanitizedHTML = DOMPurify.sanitize('<span style="color:red">'+tex+'</span>');
        return { __html: sanitizedHTML, hasError: true };
      }

      return { __html: html, hasError: false };
    } catch (e) {
      console.error('KaTeX render error:', e);
      return { __html: '<span style="color:red">Syntax Error</span>', hasError: true };
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problemId]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', position: 'relative' }}>
      {/* 正解時の大きな丸のオーバーレイ */}
      {isCorrect && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.6s forwards'
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '200px',
              color: 'white',
              animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.6s forwards',
            }}
          >
            ⭕
          </div>
        </div>
      )}

      {/* ヘッダー部分 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>TeX RPG</h1>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Score: {score}</div>
      </div>

      {/* ゲームクリア時の表示 */}
      {problemId >= PROBLEMS.length - 1 && feedback.includes('Game Clear') ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2>{feedback}</h2>
        </div>
      ) : (
        <>
          {/* 問題表示エリア */}
          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#666', marginBottom: '10px' }}>Question {problemId + 1}: {currentProblem.description}</p>
            {/* ここにターゲットとなる数式を表示 */}
            <div 
              style={{ fontSize: '2.5em' }}
              dangerouslySetInnerHTML={renderMath(currentProblem.answer)} 
            />
          </div>

          {/* 入力エリア */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>TeXコードを入力:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => checkAnswer(e.target.value)}
              ref={inputRef}
              disabled={isCorrect}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                borderRadius: '5px',
                border: isCorrect ? '2px solid #4caf50' : '2px solid #ccc', // 正解すると枠が緑になる
                outline: 'none',
                fontFamily: 'monospace'
              }}
              autoFocus
            />
          </div>

          {/* リアルタイムプレビュー & フィードバック */}
          <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px',minHeight: '80px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px'}}>Your Preview:</div>
              <div
                style={{ fontSize: '2.5em', minHeight: '40px' }}
                dangerouslySetInnerHTML={renderMath(input)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '10px' }}>
            {/* メッセージ表示（左寄せ） */}
            <div>
              {feedback && <div style={{ color: isCorrect ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>{feedback}</div>}
            </div>
          </div>
          
        </>
      )}
    </div>
  );
}
