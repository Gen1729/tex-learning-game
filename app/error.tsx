"use client"
import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Georgia, "Times New Roman", serif',
      lineHeight: '1.6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
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
          TeX Learning
        </h1>
      </header>

      {/* エラー表示 */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          border: '2px solid #333',
          padding: '60px 40px',
          textAlign: 'center',
          backgroundColor: '#fafafa'
        }}>
          {/* LaTeX風の500表示 */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              fontSize: '120px', 
              fontWeight: 'bold',
              color: '#d32f2f',
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1',
              marginBottom: '20px'
            }}>
              500
            </div>
            <div style={{ 
              fontSize: '24px', 
              color: '#666',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              marginBottom: '30px'
            }}>
              \error{'{'}compilation failed{'}'}
            </div>
            <div style={{ 
              fontSize: '18px', 
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '10px'
            }}>
              Server Error
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: '#777',
              maxWidth: '500px',
              margin: '0 auto 40px'
            }}>
              サーバーエラーが発生しました。<br />
              しばらく待ってから再度お試しください。
            </div>
          </div>

          {/* LaTeXエラーログ風の表示 */}
          <div style={{
            backgroundColor: '#fff3f3',
            border: '1px solid #ffcdd2',
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            textAlign: 'left',
            marginBottom: '30px',
            color: '#c62828',
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            <div>! LaTeX Error: Something went wrong.</div>
            <div style={{ marginTop: '10px' }}>See the error log below for more information:</div>
            <div style={{ marginTop: '10px', color: '#666' }}>Type: {error.name}</div>
            {error.digest && (
              <div style={{ color: '#666' }}>Digest: {error.digest}</div>
            )}
            <div style={{ marginTop: '10px', color: '#666' }}>% {error.message}</div>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* リトライボタン */}
            <button
              onClick={reset}
              style={{
                border: '2px solid #d32f2f',
                padding: '15px 40px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#d32f2f',
                color: '#fff',
                transition: 'all 0.2s',
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b71c1c';
                e.currentTarget.style.borderColor = '#b71c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#d32f2f';
                e.currentTarget.style.borderColor = '#d32f2f';
              }}
            >
              再試行
            </button>

            {/* ホームに戻るボタン */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{
                border: '2px solid #333',
                padding: '15px 40px',
                fontSize: '18px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                transition: 'all 0.2s',
                display: 'inline-block',
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#000';
              }}
              >
                ホームに戻る
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}