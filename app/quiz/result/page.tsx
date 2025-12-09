"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const correctCount = parseInt(searchParams.get('correct') || '0');
  const wrongCount = parseInt(searchParams.get('wrong') || '0');
  const totalProblems = correctCount + wrongCount;

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Georgia, "Times New Roman", serif',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>
      {/* ヘッダー */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '60px',
        borderBottom: '2px solid #333',
        paddingBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'normal',
          margin: '0 0 10px 0',
          letterSpacing: '2px'
        }}>
          Quiz Result
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#555',
          fontStyle: 'italic',
          margin: 0
        }}>
          お疲れ様でした！
        </p>
      </header>

      {/* 結果表示 */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          border: '2px solid #333',
          padding: '60px 40px',
          textAlign: 'center',
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'normal',
            marginBottom: '50px',
            borderBottom: '1px solid #666',
            paddingBottom: '15px'
          }}>
            スコア
          </h2>

          {/* 正解数（中央に大きく） */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              fontSize: '20px', 
              color: '#000',
              marginBottom: '15px',
              letterSpacing: '2px'
            }}>
              正解数
            </div>
            <div style={{ 
              fontSize: '120px', 
              fontWeight: 'bold',
              color: '#4caf50',
              fontFamily: 'Arial, sans-serif',
              lineHeight: '1'
            }}>
              {correctCount}
            </div>
            <div style={{ 
              fontSize: '18px', 
              color: '#000',
              marginTop: '10px'
            }}>
              問
            </div>
          </div>

          {/* 不正解数（右下に控えめ） */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '30px',
            textAlign: 'right'
          }}>
            <div style={{ 
              fontSize: '15px', 
              color: '#000',
              marginBottom: '5px'
            }}>
              間違えた回数
            </div>
            <div style={{ 
              fontSize: '30px', 
              fontWeight: 'bold',
              color: '#f44336',
              fontFamily: 'Arial, sans-serif'
            }}>
              {wrongCount}
              <span style={{ 
                fontSize: '15px', 
                color: '#000',
                marginLeft: '5px',
                fontWeight: 'normal'
              }}>
                回
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* メッセージ */}
      <section style={{ 
        textAlign: 'center',
        marginBottom: '50px',
        padding: '30px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd'
      }}>
        <p style={{ 
          fontSize: '16px', 
          color: '#333',
          margin: 0,
          lineHeight: '1.8'
        }}>
          {correctCount === totalProblems && totalProblems > 0
            ? '完璧です！すべての問題に正解しました。'
            : correctCount >= totalProblems * 0.8
            ? '素晴らしい結果です！この調子で頑張りましょう。'
            : correctCount >= totalProblems * 0.5
            ? '良い結果です！さらなる向上を目指しましょう。'
            : 'もう一度チャレンジしてみましょう！'}
        </p>
      </section>

      {/* アクションボタン */}
      <section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* もう一度クイズに挑戦 */}
          <Link 
            href="/quiz" 
            style={{ 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '2px solid #333',
              padding: '25px 30px',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'normal',
                margin: 0
              }}>
                もう一度クイズに挑戦
              </h3>
            </div>
          </Link>

          {/* チュートリアルで復習 */}
          <Link 
            href="/tutorial" 
            style={{ 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '1px solid #333',
              padding: '25px 30px',
              transition: 'background-color 0.2s',
              cursor: 'pointer',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'normal',
                margin: 0
              }}>
                チュートリアルで復習
              </h3>
            </div>
          </Link>

          {/* ホームに戻る */}
          <Link 
            href="/" 
            style={{ 
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              border: '1px solid #999',
              padding: '20px 30px',
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
      </section>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Georgia, "Times New Roman", serif'
      }}>
        Loading...
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
