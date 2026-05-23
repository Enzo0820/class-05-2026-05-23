import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Force Next.js to not cache this route at build time or runtime
export const dynamic = 'force-dynamic';

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

const filePath = path.join(process.cwd(), 'scores.json');

// Default initial scores without emojis in code to avoid Windows encoding issues
const defaultScores: ScoreEntry[] = [
  { name: '7632 (Westport)', score: 450, date: new Date().toISOString() },
  { name: '254 (Cheesy Poofs)', score: 420, date: new Date().toISOString() },
  { name: '1678 (Citrus Circuits)', score: 390, date: new Date().toISOString() },
  { name: '2056 (OP Robotics)', score: 350, date: new Date().toISOString() },
];

async function readScores(): Promise<ScoreEntry[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, create it with default scores
    await writeScores(defaultScores);
    return defaultScores;
  }
}

async function writeScores(scores: ScoreEntry[]) {
  await fs.writeFile(filePath, JSON.stringify(scores, null, 2), 'utf-8');
}

// GET: Retrieve all scores, sorted from highest to lowest
export async function GET() {
  const scores = await readScores();
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  return NextResponse.json(sortedScores, {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}

// POST: Add a new score
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, score } = body;

    // Validate name and score
    if (!name || typeof score !== 'number' || isNaN(score)) {
      return NextResponse.json(
        { error: '請輸入有效的玩家名字與分數！' },
        { status: 400 }
      );
    }

    const newEntry: ScoreEntry = {
      name: String(name).trim() || '無名小蜜蜂',
      score: Math.floor(Number(score)),
      date: new Date().toISOString(),
    };

    const scores = await readScores();
    scores.push(newEntry);
    await writeScores(scores);

    // Return the updated sorted leaderboard
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    
    return NextResponse.json(sortedScores, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: '請求格式不正確' },
      { status: 400 }
    );
  }
}

// DELETE: Clear all scores
export async function DELETE() {
  await writeScores([]);
  return NextResponse.json([], {
    headers: {
      'Cache-Control': 'no-store, max-age=0, must-revalidate',
    },
  });
}
