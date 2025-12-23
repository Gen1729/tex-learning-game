"use client"
import Link from 'next/link';

export default function NotFound() {
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
          {/* LaTeX風の404表示 */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              fontSize: '120px', 
              fontWeight: 'bold',
              color: '#333',
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1',
              marginBottom: '20px'
            }}>
              404
            </div>
            <div style={{ 
              fontSize: '24px', 
              color: '#666',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              marginBottom: '30px'
            }}>
              \documentclass{'{'}notfound{'}'}
            </div>
            <div style={{ 
              fontSize: '18px', 
              color: '#555',
              fontStyle: 'italic',
              marginBottom: '10px'
            }}>
              Page Not Found
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: '#777',
              maxWidth: '500px',
              margin: '0 auto 40px'
            }}>
              お探しのページは見つかりませんでした。<br />
              URLが正しく入力されているか確認してください。
            </div>
          </div>

          {/* LaTeXコマンド風の説明 */}
          <div style={{
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            textAlign: 'left',
            marginBottom: '30px',
            color: '#333'
          }}>
            <div>% Error: Page not found in document tree</div>
            <div>\usepackage{'{'}navigation{'}'}</div>
            <div>\begin{'{'}document{'}'}</div>
            <div style={{ paddingLeft: '20px' }}>\section*{'{'}Available Routes{'}'}</div>
            <div style={{ paddingLeft: '20px' }}>% / (Home)</div>
            <div style={{ paddingLeft: '20px' }}>% /tutorial (Tutorial)</div>
            <div style={{ paddingLeft: '20px' }}>% /quiz/select (Quiz)</div>
            <div>\end{'{'}document{'}'}</div>
          </div>

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
      </section>
    </div>
  );
}