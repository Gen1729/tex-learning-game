// app/api/quiz/getProblem.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Problem = {
  level: number;
  answer: string;
  keyword: string[];
  time_limit: number;
};

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const minLevel = parseInt(searchParams.get('minlevel') || '1');
  const maxLevel = parseInt(searchParams.get('maxlevel') || '4');
  try {

    let completedProblems:Problem[] = [];

    for (let i:number = minLevel;i <= maxLevel;i++){
      // Supabaseから問題を取得
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('level', i)
        // .limit(10)     // 必要に応じて件数制限
        .order('level', { ascending: true }) // 並び替え

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

      if (i != maxLevel && data.length < 3){
        console.error('Data need more');
        return NextResponse.json(
          { error: 'データが少なすぎます' },
          { status: 500 }
        );
      }

      // データ型を変換（必要に応じて）
      let problems: Problem[] = data.map((row) => ({
        level: row.level,
        answer: row.answer,
        keyword: row.keyword ? row.keyword.split(" ").filter((k: string) => k.trim() !== "") : [],
        time_limit: row.time_limit,
      }));

      problems.sort((a, b) => 0.5 - Math.random());
      if (i != maxLevel)problems = problems.slice(0,3);
      else problems = problems.slice(0,1);

      completedProblems = [...completedProblems, ...problems];
    }

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