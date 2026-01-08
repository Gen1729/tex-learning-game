"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colorDifficulty = {
  chemistry : {
    "border" : "#4ca5af",
    "bg" : "#f1f8f8",
    "label" : "🧪 chemistry"
  },
  easy : {
    "border" : "#4caf50",
    "bg" : "#f1f8f4",
    "label" : "⭐ Easy"
  },
  normal : {
    "border" : "#2196f3",
    "bg" : "#e3f2fd",
    "label" : "⭐⭐ Normal"
  },
  hard : {
    "border" : "#ff9800",
    "bg" : "#fff3e0",
    "label" : "⭐⭐⭐ Hard"
  },
  lunatic : {
    "border" : "#f44336",
    "bg" : "#ffebee",
    "label" : "⭐⭐⭐⭐ Lunatic"
  }
}

const timeDifficulty = {
  extream : {
    "border" : "#b214d9",
    "bg" : "#ffebff",
    "label" : "Extream (0.50x)",
    "description" : "制限時間が鬼短くなります（人外向け）",
    "time" : 0.5
  },
  short : {
    "border" : "#f44336",
    "bg" : "#ffebee",
    "label" : "Short (0.75x)",
    "description" : "制限時間が短くなります（上級者向け）",
    "time" : 0.75
  },
  normal : {
    "border" : "#ff9800",
    "bg" : "#fff3e0",
    "label" : "Normal (1.0x)",
    "description" : "標準的な制限時間です",
    "time" : 1.0
  },
  long : {
    "border" : "#2196f3",
    "bg" : "#e3f2fd",
    "label" : "Long (1.5x)",
    "description" : "制限時間が長くなります（初心者向け）",
    "time" : 1.5
  },
  longLong : {
    "border" : "#4caf50",
    "bg" : "#f1f8f4",
    "label" : "LongLong (2.0x)",
    "description" : "制限時間が大分長くなります（苦手な人向け）",
    "time" : 2.0
  }
}

export default function QuizSelectPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1);

  const handleStart = () => {
    sessionStorage.clear();
    router.push(`/quiz?level=${selectedLevel}&time=${timeMultiplier}`);
  };

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
          Quiz Settings
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#555',
          fontStyle: 'italic',
          margin: 0
        }}>
          難易度と時間制限を選択してください
        </p>
      </header>

      {/* 設定セクション */}
      <section style={{ marginBottom: '50px' }}>
        {/* 難易度選択 */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'normal',
            marginBottom: '30px',
            borderBottom: '1px solid #666',
            paddingBottom: '10px'
          }}>
            難易度
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.values(colorDifficulty).map((diff,index) => (
              <div
                key={index}
                onClick={() => setSelectedLevel(index)}
                style={{
                  border: selectedLevel === (index) ? `3px solid ${diff.border}` : '1px solid #333',
                  padding: '25px 30px',
                  cursor: 'pointer',
                  backgroundColor: selectedLevel === (index) ? `${diff.bg}` : '#fff',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedLevel !== (index)) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLevel !== (index)) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'normal',
                      margin: '0 0 10px 0',
                      color: selectedLevel === (index) ? `${diff.border}` : '#333'
                    }}>
                      {diff.label}
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      color: '#555',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {index == 0 ? " beta version ": `（Level ${index + 1}-${index + 5}）`}
                    </p>
                  </div>
                  {selectedLevel === (index) && (
                    <div style={{ fontSize: '30px', color: `${diff.border}` }}>✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 時間制限選択 */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'normal',
            marginBottom: '30px',
            borderBottom: '1px solid #666',
            paddingBottom: '10px'
          }}>
            時間制限
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.values(timeDifficulty).map((diff,index) => (
              <div
                key={index}
                onClick={() => setTimeMultiplier(diff.time)}
                style={{
                  border: timeMultiplier === diff.time ? `3px solid ${diff.border}` : '1px solid #333',
                  padding: '25px 30px',
                  cursor: 'pointer',
                  backgroundColor: timeMultiplier === diff.time ? `${diff.bg}` : '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (timeMultiplier !== diff.time) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (timeMultiplier !== diff.time) {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'normal',
                      margin: '0 0 10px 0',
                      color: timeMultiplier === diff.time ? `${diff.border}` : '#333'
                    }}>
                      {diff.label}
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      color: '#555',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {diff.description}
                    </p>
                  </div>
                  {timeMultiplier === diff.time && (
                    <div style={{ fontSize: '30px', color: `${diff.border}` }}>✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ボタンエリア */}
      <section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 開始ボタン */}
          <button
            onClick={handleStart}
            style={{
              border: '3px solid #666',
              padding: '25px 30px',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: '#fff',
              transition: 'all 0.2s',
              fontFamily: 'Georgia, "Times New Roman", serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#666';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#666';
            }}
          >
            クイズを開始
          </button>

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
