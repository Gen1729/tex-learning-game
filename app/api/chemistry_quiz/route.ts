// app/api/quiz/getProblem.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Problem = {
  level: number;
  answer: string;
  keyword: Record<string, number>;
  time_limit: number;
};

function shuffle<T>(array: T[]) {
  const out = Array.from(array);
  for (let i = out.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[r];
    out[r] = tmp;
  }
  return out;
}

export async function GET() {
  // 環境変数チェック
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { 
        error: 'Supabase環境変数が設定されていません',
        details: 'NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを設定してください'
      },
      { status: 500 }
    );
  }

  try {

    let completedProblems:Problem[] = [];
    // Supabaseから問題を取得
    const { data, error } = await supabase
      .from(`problems_chemistry`)
      .select('*')

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase query failed', 
          details: error.message,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('Data is null');
      return NextResponse.json(
        { error: 'データが取得できませんでした' },
        { status: 500 }
      );
    }

    if (data.length === 0) {
      console.warn('No data found in problems table');
      return NextResponse.json(
        { 
          problems: [],
          warning: 'テーブルにデータが存在しません。Supabaseダッシュボードでproblemsテーブルを確認してください。'
        },
        { status: 200 }
      );
    }

    // データ型を変換（必要に応じて）
    const problems: Problem[] = data.map((row) => ({
      level: 1,
      answer: row.answer,
      keyword: row.keyword || {},
      time_limit: row.time_limit,
    }));

    completedProblems = shuffle(problems);
    completedProblems = completedProblems.slice(0,10);

    console.log(completedProblems);
    
    return NextResponse.json({ problems: completedProblems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching problems:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: errorMessage },
      { status: 500 }
    );
  }
}