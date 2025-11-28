"use client"
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Georgia, "Times New Roman", serif',
      lineHeight: '1.6'
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
        <p style={{ 
          fontSize: '18px', 
          color: '#555',
          fontStyle: 'italic',
          margin: 0
        }}>
          Master LaTeX notation through interactive exercises
        </p>
      </header>

      {/* イントロダクション */}
      <section style={{ marginBottom: '50px' }}>
        <p style={{ 
          fontSize: '16px', 
          color: '#333',
          textAlign: 'justify',
          marginBottom: '20px'
        }}>
          このサイトでは、数式組版システムであるLaTeXの記法を、実際に手を動かしながら学ぶことができます。
          基本的な記号から複雑な数式まで、段階的にマスターしていきましょう。
        </p>
      </section>

      {/* メニューセクション */}
      <section>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'normal',
          marginBottom: '30px',
          borderBottom: '1px solid #666',
          paddingBottom: '10px'
        }}>
          Contents
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* チュートリアル */}
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
              backgroundColor: '#fff'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'normal',
                margin: '0 0 10px 0'
              }}>
                1. Tutorial
              </h3>
              <p style={{ 
                fontSize: '15px', 
                color: '#555',
                margin: 0,
                lineHeight: '1.5'
              }}>
                LaTeX記法の基礎から応用まで、60のセクションで段階的に学習できます。
                各セクションには詳しい説明があり、自分のペースで進められます。
              </p>
            </div>
          </Link>

          {/* クイズ（準備中） */}
          <div style={{
            border: '1px solid #999',
            padding: '25px 30px',
            backgroundColor: '#f9f9f9',
            opacity: 0.6,
            cursor: 'not-allowed'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'normal',
              margin: '0 0 10px 0',
              color: '#666'
            }}>
              2. Quiz <span style={{ fontSize: '14px' }}>(Coming Soon)</span>
            </h3>
            <p style={{ 
              fontSize: '15px', 
              color: '#777',
              margin: 0,
              lineHeight: '1.5'
            }}>
              ランダムに出題される問題に挑戦して、知識を定着させましょう。
              正答率や苦手分野の分析機能も予定しています。
            </p>
          </div>

          {/* タイムアタック（準備中） */}
          <div style={{
            border: '1px solid #999',
            padding: '25px 30px',
            backgroundColor: '#f9f9f9',
            opacity: 0.6,
            cursor: 'not-allowed'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'normal',
              margin: '0 0 10px 0',
              color: '#666'
            }}>
              3. Time Attack <span style={{ fontSize: '14px' }}>(Coming Soon)</span>
            </h3>
            <p style={{ 
              fontSize: '15px', 
              color: '#777',
              margin: 0,
              lineHeight: '1.5'
            }}>
              制限時間内にできるだけ多くの問題を解いて、スコアを競います。
              タイピング速度と正確性の両方が求められます。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
