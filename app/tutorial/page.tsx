"use client"
import { useRef, useEffect, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { convertLatexToMathMl } from 'mathlive';
import DOMPurify from 'dompurify';
import Link from 'next/link';

// チュートリアルデータ
const TUTORIALS = [
  { 
    id: 1, 
    answer: 'Answer = 2x + 5y - 10z', 
    description: '基本的な文字と記号',
    explanation: 'texではアルファベットは斜体、数字はそのまま表示されます。+ 、- 、= などの一部の記号もそのままです。'
  },
  { 
    id: 2, 
    answer: 'a_n = x^n', 
    description: '上付き文字、下付き文字',
    explanation: '上付き文字は ^ 、下付き文字は _ を使うことで表現できます。'
  },
  { 
    id: 3, 
    answer: 'x^p_n', 
    description: '上付き文字、下付き文字（２）',
    explanation: '一つの文字に対し、上付き文字と下付き文字の両方をつけることもできます。記述する順番は決まっていません。'
  },
  { 
    id: 4, 
    answer: 'a_{n+2} = a_{n+1} + a_n + x^{n + 1}', 
    description: '複数文字のグルーピング',
    explanation: 'もし上付き文字や下付き文字が二文字以上の場合はその文字全体を { } で囲むことが必要です。このルールは今後出てくる記法にも使用します。'
  },
  { 
    id: 5, 
    answer: '\\frac{1}{2}', 
    description: '分数',
    explanation: '分数は\\frac{分子}{分母}で表現します。特殊な記法を用いる際は\\を最初につけるのがルールです。'
  },
  { 
    id: 6, 
    answer: '\\sqrt{x}', 
    description: 'ルート',
    explanation: 'ルートは\\sqrt{中身}で表現します。また累乗根を表現したい場合は\\sqrt[次数]{中身}と記述すれば良いです。'
  },
  { 
    id: 7, 
    answer: '\\sqrt[3]{8}', 
    description: '累乗根',
    explanation: '通常のルートは \\sqrt{} ですが、3乗根などは \\sqrt[3]{} のように [ ] を使って次数を指定します。'
  },
  { 
    id: 8, 
    answer: '\\pi r^2', 
    description: 'ギリシャ文字（パイ）',
    explanation: '円周率は \\pi で表現します。ギリシャ文字の多くは読み方をそのままコマンドにします。'
  },
  { 
    id: 9, 
    answer: '\\alpha + \\beta + \\gamma', 
    description: 'ギリシャ文字（基本）',
    explanation: '\\alpha (アルファ)、\\beta (ベータ)、\\gamma (ガンマ) です。よく使う変数はスペルを覚えましょう。'
  },
  { 
    id: 10, 
    answer: '\\theta + \\phi', 
    description: 'ギリシャ文字（角度）',
    explanation: '角度によく使われるシータは \\theta です。'
  },
  { 
    id: 11, 
    answer: '\\Delta', 
    description: 'ギリシャ文字（大文字）',
    explanation: '大文字のギリシャ文字は、先頭を大文字にします。\\delta ではなく \\Delta と書くと三角形になります。'
  },
  { 
    id: 12, 
    answer: 'a \\times b \\div c', 
    description: '乗算と除算',
    explanation: '× は \\times 、÷ は \\div で表現します。キーボードの * や / とは表示が異なります。'
  },
  { 
    id: 13, 
    answer: 'x \\pm y', 
    description: 'プラスマイナス',
    explanation: 'プラスマイナス（±）は \\pm です。逆のマイナスプラス（∓）は \\mp を使います。'
  },
  { 
    id: 14, 
    answer: 'x \\neq y', 
    description: '等号否定',
    explanation: 'ノットイコール（≠）は \\neq (not equal) です。'
  },
  { 
    id: 15, 
    answer: 'x \\le y', 
    description: '不等号',
    explanation: '小なりイコール（≦）は \\le (less equal)、大なりイコール（≧）は \\ge (greater equal) です。'
  },
  { 
    id: 16, 
    answer: '\\sin \\theta', 
    description: '三角関数（サイン）',
    explanation: '単に sin と書くと斜体になってしまいます。関数として正しく表示するには \\sin と書きます。'
  },
  { 
    id: 17, 
    answer: '\\cos (2x)', 
    description: '三角関数（コサイン）',
    explanation: '\\cos も同様です。括弧をつけて引数を明確にすることが多いです。'
  },
  { 
    id: 18, 
    answer: '\\tan^{-1} x', 
    description: '逆三角関数',
    explanation: '\\tan (タンジェント) に上付き文字 ^-1 を組み合わせることでアークタンジェントを表現できます。'
  },
  { 
    id: 19, 
    answer: '\\log x', 
    description: '対数関数',
    explanation: 'ログは \\log を使います。これも斜体にならないようにするためのコマンドです。'
  },
  { 
    id: 20, 
    answer: '\\log_{10} 100', 
    description: '対数の底',
    explanation: '\\log の後に下付き文字 _ を使うことで、底（base）を指定できます。'
  },
  { 
    id: 21, 
    answer: '\\ln e', 
    description: '自然対数',
    explanation: '自然対数は \\ln を使います。'
  },
  { 
    id: 22, 
    answer: '\\infty', 
    description: '無限大',
    explanation: '無限大（∞）は \\infty (infinity) で表現します。'
  },
  { 
    id: 23, 
    answer: 'x \\to \\infty', 
    description: '矢印',
    explanation: '右矢印（→）は \\to または \\rightarrow で表現します。'
  },
  { 
    id: 24, 
    answer: '\\lim_{x \\to 0}', 
    description: '極限',
    explanation: '\\lim (limit) の下付き文字として x \\to 0 を記述すると、limの下に配置されます。'
  },
  { 
    id: 25, 
    answer: '\\sum_{k=1}^{n} k', 
    description: '総和（シグマ）',
    explanation: '\\sum でシグマ記号を表示します。下付き文字で開始値、上付き文字で終了値を指定します。'
  },
  { 
    id: 26, 
    answer: '\\int f(x) dx', 
    description: '積分',
    explanation: 'インテグラル記号は \\int です。dx の前には少しスペースを入れることもありますが、まずはこれでOKです。'
  },
  { 
    id: 27, 
    answer: '\\int_{0}^{1} x^2 dx', 
    description: '定積分',
    explanation: '\\int に上付き・下付き文字をつけることで積分範囲を指定できます。'
  },
  { 
    id: 28, 
    answer: '\\{ a, b \\}', 
    description: '波括弧のエスケープ',
    explanation: '{ } はTeXの構文で使われるため、文字として表示したい場合は \\{ \\} とエスケープが必要です。'
  },
  { 
    id: 29, 
    answer: '\\left( \\frac{1}{2} \\right)', 
    description: '括弧の自動サイズ調整',
    explanation: '単なる ( ) では分数を囲むときに小さすぎます。\\left( と \\right) を使うと中身に合わせて拡大します。'
  },
  { 
    id: 30, 
    answer: '\\left| x \\right|', 
    description: '絶対値',
    explanation: '絶対値の縦棒は | ですが、\\left| \\right| を使うことでサイズ調整が可能です。'
  },
  { 
    id: 31, 
    answer: 'x \\in A', 
    description: '集合の要素',
    explanation: '「要素である」記号は \\in です。'
  },
  { 
    id: 32, 
    answer: 'A \\subset B', 
    description: '部分集合',
    explanation: '「部分集合である」記号は \\subset です。'
  },
  { 
    id: 33, 
    answer: 'A \\cap B', 
    description: '共通部分（キャップ）',
    explanation: '帽子のような形（∩）は \\cap (cap) です。'
  },
  { 
    id: 34, 
    answer: 'A \\cup B', 
    description: '和集合（カップ）',
    explanation: 'カップのような形（∪）は \\cup (cup) です。'
  },
  { 
    id: 35, 
    answer: '\\forall x', 
    description: '全称記号（Aの逆）',
    explanation: '「すべての」を表す記号は \\forall (for all) です。'
  },
  { 
    id: 36, 
    answer: '\\exists y', 
    description: '存在記号（Eの逆）',
    explanation: '「存在する」を表す記号は \\exists (exists) です。'
  },
  { 
    id: 37, 
    answer: '\\hat{a}', 
    description: 'アクセント記号（ハット）',
    explanation: '文字の上に帽子を載せるには \\hat{} を使います。'
  },
  { 
    id: 38, 
    answer: '\\bar{x}', 
    description: 'アクセント記号（バー）',
    explanation: '平均値などで使うバーは \\bar{} を使います。'
  },
  { 
    id: 39, 
    answer: '\\vec{v}', 
    description: 'ベクトル',
    explanation: 'ベクトルの矢印は \\vec{} を使います。'
  },
  { 
    id: 40, 
    answer: '\\overrightarrow{OA}', 
    description: '長いベクトル',
    explanation: '2文字以上に矢印をかけたい場合は \\overrightarrow{} を使います。'
  },
  { 
    id: 41, 
    answer: '\\dot{x}', 
    description: '時間微分（ドット）',
    explanation: '文字の上の点は \\dot{} で表現します。2つの点は \\ddot{} です。'
  },
  { 
    id: 42, 
    answer: '\\mathbb{R}', 
    description: '黒板太字',
    explanation: '実数集合Rのような二重線フォントは \\mathbb{} (blackboard bold) を使います。'
  },
  { 
    id: 43, 
    answer: '\\mathbf{x}', 
    description: '太字',
    explanation: '太字にしたい場合は \\mathbf{} (math bold font) を使います。'
  },
  { 
    id: 44, 
    answer: '\\partial f', 
    description: '偏微分記号',
    explanation: '偏微分の記号（ラウンドディー）は \\partial で出せます。'
  },
  { 
    id: 45, 
    answer: '\\nabla', 
    description: 'ナブラ',
    explanation: '逆三角形の演算子は \\nabla です。'
  },
  { 
    id: 46, 
    answer: 'x_1, \\ldots, x_n', 
    description: '3点ドット',
    explanation: '下付きの3点は\\ldotsを使います。中央の3点は \\cdots を使います。\\dotsを使うと、場面に応じて自動でドットの種類を判定してくれます（ただし、本サイトのクイズでは正解となりません）。'
  },
  { 
    id: 47, 
    answer: '\\begin{matrix} a & b \\\\ c & d \\end{matrix}', 
    description: '行列（基本）',
    explanation: '\\begin{matrix} ... \\end{matrix} で囲みます。列区切りは & 、行区切りは \\\\ です。'
  },
  { 
    id: 48, 
    answer: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', 
    description: '行列（括弧付き）',
    explanation: 'pをつけて {pmatrix} にすると、自動で ( ) がついた行列になります。'
  },
  { 
    id: 49, 
    answer: '\\begin{cases} x & x>0 \\\\ -x & x\\le0 \\end{cases}', 
    description: '場合分け',
    explanation: '{cases} 環境を使うと、場合分けの大きな { を表現できます。'
  },
];

const MAXTEXTSIZE:number = 200;

export default function TUTORIALHOME() {
  const [sectionId, setSectionId] = useState<number>(0); // 現在のセクション番号
  const [input, setInput] = useState<string>(''); // ユーザーの入力
  const [isCorrect, setIsCorrect] = useState<boolean>(false); // 正解状態

  const inputRef = useRef<HTMLInputElement>(null);

  const currentTutorial = TUTORIALS[sectionId];

  // セクション変更時の処理
  const handleSectionChange = (newSectionId: number) => {
    setSectionId(newSectionId);
    setInput('');
    setIsCorrect(false);
  };

  // 戻るボタン
  const handlePrevious = () => {
    if (sectionId > 0) {
      handleSectionChange(sectionId - 1);
    }
  };

  // 進むボタン
  const handleNext = () => {
    if (sectionId < TUTORIALS.length - 1) {
      handleSectionChange(sectionId + 1);
    }
  };

  // 入力チェック関数
  const checkAnswer = (userInput:string) => {
    let copyUserInput:string = userInput;
    if(copyUserInput.length > MAXTEXTSIZE){
      copyUserInput = copyUserInput.substring(0,MAXTEXTSIZE);
    }
    setInput(copyUserInput);
    
    if (!currentTutorial) return;

    // 入力が空の場合は何もしない
    if (userInput.trim() === '') {
      setIsCorrect(false);
      return;
    }

    // まずKaTeXでの構文チェック
    const previewResult = renderMath(userInput);
    if (previewResult.hasError) {
      setIsCorrect(false);
      return;
    }

    // KaTeXでエラーがない場合のみMathMLで比較
    try {
      const userMathML = convertLatexToMathMl(userInput);
      const correctMathML = convertLatexToMathMl(currentTutorial.answer);

      // 判定ロジック（MathMLの比較 + 正規化後の文字列長チェック）
      // 空の中括弧などを防ぐため、正規化後の長さも確認
      if (userMathML === correctMathML) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      // MathML変換でエラーが発生した場合は不正解
      console.error('MathML conversion error:', error);
      setIsCorrect(false);
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [sectionId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* 左サイドバー - 目次 */}
      <aside style={{ 
        width: '300px', 
        backgroundColor: '#f5f5f5', 
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100vh',
        padding: '20px'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#333',
          borderBottom: '2px solid #2196f3',
          paddingBottom: '10px'
        }}>
          目次
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {TUTORIALS.map((tutorial, index) => (
            <button
              key={tutorial.id}
              onClick={() => handleSectionChange(index)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                border: 'none',
                background: sectionId === index ? '#2196f3' : 'transparent',
                color: sectionId === index ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '13px',
                borderRadius: '4px',
                transition: 'all 0.2s',
                fontWeight: sectionId === index ? 'bold' : 'normal'
              }}
              onMouseEnter={(e) => {
                if (sectionId !== index) {
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                }
              }}
              onMouseLeave={(e) => {
                if (sectionId !== index) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {index + 1}. {tutorial.description}
            </button>
          ))}
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', padding: '20px', width: '100%' }}>
        {/* ヘッダー部分 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>LaTeX Tutorial</h1>
          <div style={{ color: '#666', fontSize: '16px',paddingTop:'10px'}}>Section {sectionId + 1} / {TUTORIALS.length}</div>
          <Link 
            href="/" 
            style={{ 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '1px solid #999',
              padding: '10px 20px',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <p style={{ 
                fontSize: '16px', 
                margin: 0,
                color: '#666'
              }}>
                ホームに戻る
              </p>
            </div>
          </Link>
        </div>

        {/* 説明エリア */}
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid #2196f3', minHeight: '130px'}}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1976d2' }}>{currentTutorial.description}</h2>
          <p style={{ margin: 0, lineHeight: '1.6', color: '#333' }}>{currentTutorial.explanation}</p>
        </div>

      {/* 目標表示エリア */}
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px',minHeight: '160px'}}>
        <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}> {currentTutorial.answer} </p>
        {/* ここにターゲットとなる数式を表示 */}
        <div 
          style={{ fontSize: '2.5em' }}
          dangerouslySetInnerHTML={renderMath(currentTutorial.answer)} 
        />
      </div>

      {/* 入力エリア */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LaTeXコードを入力:</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => checkAnswer(e.target.value)}
            ref={inputRef}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: '100%',
              padding: '15px',
              paddingRight: isCorrect ? '70px' : '15px',
              fontSize: '18px',
              borderRadius: '5px',
              border: isCorrect ? '2px solid #4caf50' : '2px solid #ccc',
              outline: 'none',
              fontFamily: 'monospace',
              backgroundColor: isCorrect ? '#f1f8f4' : 'white'
            }}
            autoFocus
          />
          {/* 正解時に丸を表示 */}
          {isCorrect && (
            <div style={{ 
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '40px', 
              color: '#4caf50',
              animation: 'fadeIn 0.3s ease',
              lineHeight: '1',
              pointerEvents: 'none'
            }}>
              ⭕
            </div>
          )}
        </div>
      </div>

      {/* リアルタイムプレビュー */}
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '10px', minHeight: '80px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px'}}>Preview</div>
        <div
          style={{ fontSize: '2.5em', minHeight: '70px' }}
          dangerouslySetInnerHTML={renderMath(input)}
        />
      </div>

      {/* フィードバックメッセージを削除 */}

      {/* ナビゲーションボタン */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button
          onClick={handlePrevious}
          disabled={sectionId === 0}
          style={{
            background: sectionId === 0 ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: sectionId === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: sectionId === 0 ? 0.5 : 1
          }}
        >
          ← 前へ
        </button>
        
        <button
          onClick={handleNext}
          disabled={sectionId === TUTORIALS.length - 1}
          style={{
            background: sectionId === TUTORIALS.length - 1 ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            fontSize: '16px',
            borderRadius: '5px',
            cursor: sectionId === TUTORIALS.length - 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: sectionId === TUTORIALS.length - 1 ? 0.5 : 1
          }}
        >
          次へ →
        </button>
      </div>
      </main>
    </div>
  );
}