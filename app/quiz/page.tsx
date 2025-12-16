"use client"
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { convertLatexToMathMl } from 'mathlive';
import DOMPurify from 'dompurify';

type Problem = {
  level: number;
  answer: string;
  keyword: string[];
  time_limit: number;
};

const MAXTEXTSIZE:number = 70;

export default function QUIZPAGE() {
  const router = useRouter();
  const [problemId, setProblemId] = useState<number>(0); // 現在のセクション番号
  const [input, setInput] = useState<string>(''); // ユーザーの入力
  const [prevAnswer, setPrevAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false); // 正解状態
  const [isShaking, setIsShaking] = useState<boolean>(false); // 震えるアニメーション用
  const [showCircle, setShowCircle] = useState<boolean>(false); // 正解時の丸表示用
  const [showTimeUp, setShowTimeUp] = useState<boolean>(false); // 時間切れ表示用
  const [showPop,setShowPop] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(100); // 残り時間
  const [correctCount, setCorrectCount] = useState<number>(0); // 正解数
  const [wrongCount, setWrongCount] = useState<number>(0); // 不正解数
  const [problems, setProblems] = useState<Problem[]>([]); // APIから取得した問題データ
  const [isLoading, setIsLoading] = useState<boolean>(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラー状態

  const inputRef = useRef<HTMLInputElement>(null);

  // データベースから問題を取得
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quiz?minlevel=1&maxlevel=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        
        const data = await response.json();
        
        if (data.problems && data.problems.length > 0) {
          setProblems(data.problems);
          setTimeLeft(data.problems[0].time_limit); // 取得したデータから設定
          setError(null);
        } else {
          const errorMsg = data.warning || data.error || '問題データが空です';
          console.error('No problems available:', errorMsg);
          throw new Error(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('問題の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const currentProblem = problems[problemId];

  // 震えるアニメーションをトリガーする関数
  const triggerShake = () => {
    setIsShaking(true);
  };

  const handleProblem = useCallback(() => {
    setProblemId(problemId + 1);
    setPrevAnswer("");
    setInput("");
    setIsCorrect(false);
    setTimeLeft(problems[problemId + 1].time_limit); // タイマーをリセット
  }, [problemId,problems]);

  // タイマーのカウントダウン
  useEffect(() => {
    if (isLoading || timeLeft <= 0 || isCorrect || showCircle || showTimeUp || showPop) {
      return; // ローディング中、時間切れ、正解済み、または円表示中は停止
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          return 0;
        }
        return prev - 0.1; // 0.1秒ごとに減少
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isLoading, timeLeft, isCorrect, showCircle, showTimeUp, showPop]);

  // 時間切れの処理
  useEffect(() => {
    if (timeLeft <= 0 && !isCorrect && !showCircle && !showTimeUp && !showPop) {
      const timer = setTimeout(() => {
        setShowTimeUp(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isCorrect, showCircle, showTimeUp, showPop]);

  useEffect(() => {
    if (showTimeUp) {
      const timer = setTimeout(() => {
        setShowTimeUp(false);
        setShowPop(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showTimeUp, problemId, handleProblem, router, correctCount, wrongCount]);

  // isShakingがtrueになったら0.5秒後にfalseに戻す
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 500); // 0.5秒間震える

      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  // showCircleがtrueになったら1秒後にfalseに戻し、次の問題へ遷移
  useEffect(() => {
    if (showCircle) {
      const timer = setTimeout(() => {
        setShowCircle(false);
        setShowPop(true)
      }, 1000); // 1秒間表示

      return () => clearTimeout(timer);
    }
  }, [showCircle, problemId, handleProblem, router, correctCount, wrongCount, problems.length]);

  //問題間の答え確認タイム
  useEffect(() => {
    if (showPop) {
      const timer = setTimeout(() => {
        setShowPop(false);
        // 円の表示が終わったら次の問題に遷移
        if (timeLeft > 0 && problemId < problems.length - 1) {
          handleProblem();
        } else {
          setIsLoading(true);
          // TimeUpまたは最終問題の場合は結果ページへ
          router.push(`/quiz/result?correct=${correctCount}&wrong=${wrongCount}&total=${problems.length}`);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, timeLeft, showPop, problemId, handleProblem, router, correctCount, wrongCount, problems.length]);

  

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

    if(timeLeft <= 0) return;

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
      setWrongCount(wrongCount + 1); // 不正解カウント増加
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
        for (const k of currentProblem.keyword){
          if (!userInput.includes(k)){
            setIsCorrect(false);
            setPrevAnswer(input);
            setWrongCount(wrongCount + 1); // 不正解カウント増加
            triggerShake();
            return;
          }
        }
        setIsCorrect(true);
        setPrevAnswer(input);
        setCorrectCount(correctCount + 1); // 正解カウント増加
        setShowCircle(true); // 正解の丸を表示
      } else {
        setIsCorrect(false);
        setPrevAnswer(input);
        setWrongCount(wrongCount + 1); // 不正解カウント増加
        triggerShake();
      }
    } catch (error) {
      // MathML変換でエラーが発生した場合は不正解
      console.error('MathML conversion error:', error);
      setIsCorrect(false);
      setPrevAnswer(input);
      setWrongCount(wrongCount + 1); // 不正解カウント増加
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
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [problemId, isLoading]);

  // ローディング画面
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Georgia, "Times New Roman", serif',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '24px', color: '#333' }}>Loading...</div>
        {timeLeft > 0 ? (
          <div style={{ fontSize: '16px', color: '#666' }}>問題を読み込んでいます</div>
        ) : (
          <div style={{ fontSize: '16px', color: '#666' }}>成績を読み込んでいます</div>
        )}
      </div>
    );
  }

  // エラー画面
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Georgia, "Times New Roman", serif',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '24px', color: '#f44336' }}>エラー</div>
        <div style={{ fontSize: '16px', color: '#666' }}>{error}</div>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            border: '2px solid #333',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  // 問題が取得できていない場合
  if (!problems || problems.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Georgia, "Times New Roman", serif',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '24px', color: '#666' }}>問題がありません</div>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            border: '2px solid #333',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontFamily: 'Georgia, "Times New Roman", serif'
          }}
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      {/* 正解時の赤い丸のオーバーレイ */}
      {showCircle && (
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.8s forwards'
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: '#d39595ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '100px',
              color: 'white',
              animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.8s forwards',
              boxShadow: '0 10px 40px rgba(255, 51, 51, 0.6)',
              border: '5px solid white'
            }}
          >
            ⭕
          </div>
        </div>
      )}

      {/* 時間切れ時のオーバーレイ */}
      {showTimeUp && (
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.8s forwards'
          }}
        >
          <div
            style={{
              padding: '40px 60px',
              borderRadius: '20px',
              backgroundColor: '#f44336',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              animation: 'fadeIn 0.2s ease, fadeOut 0.2s ease 0.8s forwards',
              boxShadow: '0 10px 40px rgba(244, 67, 54, 0.6)',
              border: '5px solid white'
            }}
          >
            TIME UP
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', padding: '20px', width: '100%' }}>
        {/* ヘッダー部分 */}
        <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>LaTeX QUIZ</h1>
            <div style={{ color: '#666', fontSize: '16px' }}>Problem {problemId + 1} / {problems.length}</div>
          </div>

          {/* タイムリミットのプログレスバー */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(timeLeft / problems[problemId].time_limit) * 100}%`,
                backgroundColor: (() => {
                  const ratio = timeLeft / problems[problemId].time_limit;
                  if (ratio > 0.3) return '#4caf50';
                  return '#f44336';
                })(),
                transition: 'width 0.1s linear, background-color 0.3s ease'
              }}
            />
          </div>
        </div>
          
        {/* 問題インジケーター */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {problems.map((problem, index) => {
            // レベルに応じた色を決定
            const getColorByLevel = (level: number, isCurrent: boolean) => {
              const colors: Record<number, { light: string; dark: string }> = {
                1: { light: '#a5d6a7', dark: '#4caf50' },
                2: { light: '#90caf9', dark: '#2196f3' },
                3: { light: '#ffcc80', dark: '#ff9800' },
                4: { light: '#f99a9a', dark: '#ff0000' },
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

        {/* 目標表示エリア */}
        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px',minHeight: '160px'}}>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}> Target </p>
            {/* ここにターゲットとなる数式を表示 */}
            <div 
            style={{ fontSize: '2.5em' }}
            dangerouslySetInnerHTML={renderMath(currentProblem.answer)} 
            />
        </div>

        {showPop ? (
          <div style={{textAlign: 'center'}}>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#ff0000', marginBottom: '10px',marginTop: '60px' }}>Answer</div>
            <div style={{ background: '#ffffff', border: '1px solid #000', padding: '10px', minHeight: '40px', textAlign: 'center'}}>
              <div
                style={{ fontSize: '1.5em', minHeight: '20px' }}
              >
                {currentProblem.answer}
              </div>
            </div>
          </div>
          
        ) : (
          <div>
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
                dangerouslySetInnerHTML={renderMath(prevAnswer)}
              />
            </div>
          </div>
        )}

        
      </main>
    </div>
  );
}