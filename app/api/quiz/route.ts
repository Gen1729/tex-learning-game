// app/api/quiz/getProblem.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type Problem = {
  level: number;
  answer: string;
  keyword: string[];
  time_limit: number;
};

export async function GET() {
  try {
    console.log('Fetching problems from Supabase...');
    
    // Supabaseから問題を取得
    const { data, error } = await supabase
      .from('problems')
      .select('*')
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

    // データ型を変換（必要に応じて）
    const problems: Problem[] = data.map((row) => ({
      level: row.level,
      answer: row.answer,
      keyword: row.keyword ? row.keyword.split(" ").filter((k: string) => k.trim() !== "") : [],
      time_limit: row.time_limit,
    }));

    console.log('Processed problems:', problems);
    return NextResponse.json({ problems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching problems:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: errorMessage },
      { status: 500 }
    );
  }
}