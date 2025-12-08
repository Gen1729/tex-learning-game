"use client"
import { useRef, useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { convertLatexToMathMl } from 'mathlive';
import DOMPurify from 'dompurify';
import { asyncWrapProviders } from 'async_hooks';

type Problem = {
  level: number;
  answer: string;
  keyword: string[];
};

//問題データ　後にデータベース作成する
const Problems:Problem[] = [
  {
    level: 1, 
    answer: 'Answer = 2x + 5y - 10z',
    keyword: ["Answer","x","y","z"]
  },
  { 
    level: 2, 
    answer: 'a_n = x^n',
    keyword: []
  },
  { 
    level: 3, 
    answer: 'x^p_n', 
    keyword: ["p"]
  },
];

const MAXTEXTSIZE:number = 70;

export default function QUIZPAGE() {
  const [problemId, setProblemId] = useState<number>(0); // 現在のセクション番号
  const [input, setInput] = useState<string>(''); // ユーザーの入力
  const [prevAnser, setPrevAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false); // 正解状態
  const [isShaking, setIsShaking] = useState<boolean>(false); // 震えるアニメーション用

  const inputRef = useRef<HTMLInputElement>(null);

  const currentProblem = Problems[problemId];

  // 震えるアニメーションをトリガーする関数
  const triggerShake = () => {
    setIsShaking(true);
  };

  // isShakingがtrueになったら2秒後にfalseに戻す
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 500); // 0.5秒間震える

      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const handleInput = (userInput:string) => {
    let copyUserInput:string = userInput;
    if(copyUserInput.length > MAXTEXTSIZE){
      copyUserInput = copyUserInput.substring(0,MAXTEXTSIZE);
    }
    setInput(copyUserInput);
  }

  // 入力チェック関数
  const checkAnswer = (userInput:string) => {
    let copyUserInput:string = userInput;
    if(copyUserInput.length > MAXTEXTSIZE){
      copyUserInput = copyUserInput.substring(0,MAXTEXTSIZE);
    }
    setInput(copyUserInput);
    
    if (!currentProblem) return;

    // 入力が空の場合は何もしない
    if (userInput.trim() === '') {
      setIsCorrect(false);
      return;
    }

    // まずKaTeXでの構文チェック
    const previewResult = renderMath(userInput);
    if (previewResult.hasError) {
      setIsCorrect(false);
      setPrevAnswer(input);
      triggerShake();
      return;
    }

    // KaTeXでエラーがない場合のみMathMLで比較
    try {
      const userMathML = convertLatexToMathMl(userInput);
      const correctMathML = convertLatexToMathMl(currentProblem.answer);

      // 判定ロジック（MathMLの比較 + 正規化後の文字列長チェック）
      // 空の中括弧などを防ぐため、正規化後の長さも確認
      if (userMathML === correctMathML) {
        setIsCorrect(true);
        setPrevAnswer(input);

        setProblemId(problemId + 1);
        setPrevAnswer("");
        setInput("");
        setIsCorrect(false);
      } else {
        setIsCorrect(false);
        setPrevAnswer(input);
        triggerShake();
      }
    } catch (error) {
      // MathML変換でエラーが発生した場合は不正解
      console.error('MathML conversion error:', error);
      setIsCorrect(false);
      setPrevAnswer(input);
      triggerShake();
    }
  };

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

  const handleKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter")return;
    e.preventDefault();
    checkAnswer(input);
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problemId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* メインコンテンツ */}
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', padding: '20px', width: '100%' }}>
        {/* ヘッダー部分 */}
        <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>LaTeX QUIZ</h1>
            <div style={{ color: '#666', fontSize: '16px' }}>Problem {problemId + 1} / {Problems.length}</div>
          </div>
          
          {/* 問題インジケーター */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Problems.map((problem, index) => {
              // レベルに応じた色を決定
              const getColorByLevel = (level: number, isCurrent: boolean) => {
                const colors: Record<number, { light: string; dark: string }> = {
                  1: { light: '#a5d6a7', dark: '#4caf50' }, // 緑（易しい）
                  2: { light: '#90caf9', dark: '#2196f3' }, // 青（普通）
                  3: { light: '#ffcc80', dark: '#ff9800' }, // オレンジ（難しい）
                };
                const colorSet = colors[level] || colors[1];
                return isCurrent ? colorSet.dark : colorSet.light;
              };

              const isCurrent = index === problemId;
              const backgroundColor = getColorByLevel(problem.level, isCurrent);

              return (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height:'20px',
                    backgroundColor,
                    border: isCurrent ? '1px solid #333' : '1px solid #999',
                    borderRadius: '3px',
                    transition: 'all 0.3s ease',
                    opacity: isCurrent ? 1 : 0.6,
                    boxShadow: isCurrent ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                  }}
                  title={`Problem ${index + 1} (Level ${problem.level})`}
                />
              );
            })}
          </div>
        </div>

        {/* 目標表示エリア */}
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px',minHeight: '160px'}}>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}> Target </p>
            {/* ここにターゲットとなる数式を表示 */}
            <div 
            style={{ fontSize: '2.5em' }}
            dangerouslySetInnerHTML={renderMath(currentProblem.answer)} 
            />
        </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LaTeXコードを入力:</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            ref={inputRef}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={handleKeyDownEnter}
            style={{
              width: '100%',
              padding: '15px',
              paddingRight: '15px',
              fontSize: '18px',
              borderRadius: '5px',
              border: isCorrect 
                ? '2px solid #4caf50' 
                : isShaking 
                  ? '2px solid red' 
                  : '2px solid #ccc',
              animation: isShaking ? 'shake 0.5s' : 'none',
              outline: 'none',
              fontFamily: 'monospace',
              backgroundColor: isCorrect ? '#f1f8f4' : 'white'
            }}
            autoFocus
          />
        </div>
      </div>

      {/* リアルタイムプレビュー */}
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', minHeight: '80px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px'}}>prev your Answer</div>
        <div
          style={{ fontSize: '2.5em', minHeight: '70px' }}
          dangerouslySetInnerHTML={renderMath(prevAnser)}
        />
      </div>
      </main>
    </div>
  );
}