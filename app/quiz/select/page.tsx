"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuizSelectPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number>(1); // 1=Easy, 2=Normal, 3=Hard
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1); // 0.5=Short, 1=Normal, 1.5=Long

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
            {/* Easy */}
            <div
              onClick={() => setSelectedLevel(1)}
              style={{
                border: selectedLevel === 1 ? '3px solid #4caf50' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: selectedLevel === 1 ? '#f1f8f4' : '#fff',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedLevel !== 1) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLevel !== 1) {
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
                    color: selectedLevel === 1 ? '#4caf50' : '#333'
                  }}>
                    ⭐ Easy
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    （Level 1-5）
                  </p>
                </div>
                {selectedLevel === 1 && (
                  <div style={{ fontSize: '30px', color: '#4caf50' }}>✓</div>
                )}
              </div>
            </div>

            {/* Normal */}
            <div
              onClick={() => setSelectedLevel(2)}
              style={{
                border: selectedLevel === 2 ? '3px solid #2196f3' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: selectedLevel === 2 ? '#e3f2fd' : '#fff',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedLevel !== 2) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLevel !== 2) {
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
                    color: selectedLevel === 2 ? '#2196f3' : '#333'
                  }}>
                    ⭐⭐ Normal
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    （Level 2-6）
                  </p>
                </div>
                {selectedLevel === 2 && (
                  <div style={{ fontSize: '30px', color: '#2196f3' }}>✓</div>
                )}
              </div>
            </div>

            {/* Hard */}
            <div
              onClick={() => setSelectedLevel(3)}
              style={{
                border: selectedLevel === 3 ? '3px solid #ff9800' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: selectedLevel === 3 ? '#fff3e0' : '#fff',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedLevel !== 3) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLevel !== 3) {
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
                    color: selectedLevel === 3 ? '#ff9800' : '#333'
                  }}>
                    ⭐⭐⭐ Hard
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    （Level 3-7）
                  </p>
                </div>
                {selectedLevel === 3 && (
                  <div style={{ fontSize: '30px', color: '#ff9800' }}>✓</div>
                )}
              </div>
            </div>

            {/* Lunatic */}
            <div
              onClick={() => setSelectedLevel(4)}
              style={{
                border: selectedLevel === 4 ? '3px solid #f44336' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: selectedLevel === 4 ? '#ffebee' : '#fff',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedLevel !== 4) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLevel !== 4) {
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
                    color: selectedLevel === 4 ? '#f44336' : '#333'
                  }}>
                    ⭐⭐⭐⭐ Lunatic
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    （Level 4-8）
                  </p>
                </div>
                {selectedLevel === 4 && (
                  <div style={{ fontSize: '30px', color: '#f44336' }}>✓</div>
                )}
              </div>
            </div>
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
            {/* Extream */}
            <div
              onClick={() => setTimeMultiplier(0.50)}
              style={{
                border: timeMultiplier === 0.50 ? '3px solid #b214d9' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: timeMultiplier === 0.50 ? '#ffebffff' : '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (timeMultiplier !== 0.50) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (timeMultiplier !== 0.50) {
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
                    color: timeMultiplier === 0.50 ? '#b214d9' : '#333'
                  }}>
                    Extream (0.50x)
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    制限時間が鬼短くなります（人外向け）
                  </p>
                </div>
                {timeMultiplier === 0.50 && (
                  <div style={{ fontSize: '30px', color: '#b214d9' }}>✓</div>
                )}
              </div>
            </div>
            
            {/* Short */}
            <div
              onClick={() => setTimeMultiplier(0.75)}
              style={{
                border: timeMultiplier === 0.75 ? '3px solid #f44336' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: timeMultiplier === 0.75 ? '#ffebee' : '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (timeMultiplier !== 0.75) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (timeMultiplier !== 0.75) {
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
                    color: timeMultiplier === 0.75 ? '#f44336' : '#333'
                  }}>
                    Short (0.75x)
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    制限時間が短くなります（上級者向け）
                  </p>
                </div>
                {timeMultiplier === 0.75 && (
                  <div style={{ fontSize: '30px', color: '#f44336' }}>✓</div>
                )}
              </div>
            </div>

            {/* Normal */}
            <div
              onClick={() => setTimeMultiplier(1)}
              style={{
                border: timeMultiplier === 1 ? '3px solid #2196f3' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: timeMultiplier === 1 ? '#e3f2fd' : '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (timeMultiplier !== 1) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (timeMultiplier !== 1) {
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
                    color: timeMultiplier === 1 ? '#2196f3' : '#333'
                  }}>
                    Normal (1.0x)
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    標準的な制限時間
                  </p>
                </div>
                {timeMultiplier === 1 && (
                  <div style={{ fontSize: '30px', color: '#2196f3' }}>✓</div>
                )}
              </div>
            </div>

            {/* Long */}
            <div
              onClick={() => setTimeMultiplier(1.5)}
              style={{
                border: timeMultiplier === 1.5 ? '3px solid #4caf50' : '1px solid #333',
                padding: '25px 30px',
                cursor: 'pointer',
                backgroundColor: timeMultiplier === 1.5 ? '#f1f8f4' : '#fff',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (timeMultiplier !== 1.5) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (timeMultiplier !== 1.5) {
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
                    color: timeMultiplier === 1.5 ? '#4caf50' : '#333'
                  }}>
                    Long (1.5x)
                  </h3>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#555',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    制限時間が長くなります（初心者向け）
                  </p>
                </div>
                {timeMultiplier === 1.5 && (
                  <div style={{ fontSize: '30px', color: '#4caf50' }}>✓</div>
                )}
              </div>
            </div>
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
