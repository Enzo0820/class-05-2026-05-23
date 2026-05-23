"use client";

import { useState, useEffect } from 'react';

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

interface FloatingRobot {
  id: number;
  startX: string;
  startY: string;
  mid1X: string;
  mid1Y: string;
  mid2X: string;
  mid2Y: string;
  endX: string;
  endY: string;
  startRot: string;
  mid1Rot: string;
  mid2Rot: string;
  endRot: string;
  scale: number;
  duration: number;
}

export default function Home() {
  // State variables
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [floatingRobots, setFloatingRobots] = useState<FloatingRobot[]>([]);

  // Fetch scores on mount and start background robots
  useEffect(() => {
    fetchScores();
    
    // Spawn 6 initial background robots
    spawnRobots(6);

    // Periodically spawn 1 to 2 new robots every 4 seconds
    const interval = setInterval(() => {
      spawnRobots(Math.floor(Math.random() * 2) + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/scores?t=${Date.now()}`);
      if (!res.ok) throw new Error('無法取得排行榜資料');
      const data = await res.json();
      setScores(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('請輸入隊伍名稱或編號！');
      return;
    }

    const scoreNum = parseInt(score, 10);
    if (isNaN(scoreNum) || scoreNum < 0) {
      setError('請輸入有效的比賽分數！');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          score: scoreNum,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '提交分數失敗');
      }

      const updatedScores = await res.json();
      setScores(updatedScores);
      setName('');
      setScore('');
      setSuccess(true);
      
      // Trigger robot storm!
      spawnRobots(15);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || '發生錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle clearing all scores
  const handleClearAll = async () => {
    const confirmClear = window.confirm('確定要清除所有排行榜上的 FRC 分數嗎？這個動作無法復原喔！🤖🧹');
    if (!confirmClear) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/scores', {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('清除失敗');
      const data = await res.json();
      setScores(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || '清除時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  // Spawn FRC 7632 robots running around from all directions
  const spawnRobots = (count: number) => {
    const sides = ['top', 'right', 'bottom', 'left'];
    const newRobots: FloatingRobot[] = Array.from({ length: count }).map((_, i) => {
      const startSide = sides[Math.floor(Math.random() * 4)];
      let startX = 0;
      let startY = 0;
      
      if (startSide === 'top') {
        startX = Math.random() * 100;
        startY = -15;
      } else if (startSide === 'right') {
        startX = 115;
        startY = Math.random() * 100;
      } else if (startSide === 'bottom') {
        startX = Math.random() * 100;
        startY = 115;
      } else { // left
        startX = -15;
        startY = Math.random() * 100;
      }

      let endX = Math.random() * 100;
      let endY = Math.random() * 100;
      if (startSide === 'top') {
        endY = 115;
      } else if (startSide === 'bottom') {
        endY = -15;
      } else if (startSide === 'left') {
        endX = 115;
      } else { // right
        endX = -15;
      }

      // Curves
      const mid1X = startX + (endX - startX) * 0.33 + (Math.random() * 40 - 20);
      const mid1Y = startY + (endY - startY) * 0.33 + (Math.random() * 40 - 20);
      const mid2X = startX + (endX - startX) * 0.66 + (Math.random() * 40 - 20);
      const mid2Y = startY + (endY - startY) * 0.66 + (Math.random() * 40 - 20);

      // Rotation heading
      const dx = endX - startX;
      const dy = endY - startY;
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      
      const startRot = angleDeg;
      const mid1Rot = angleDeg + (Math.random() * 60 - 30);
      const mid2Rot = angleDeg + (Math.random() * 60 - 30);
      const endRot = angleDeg;

      const scale = 0.6 + Math.random() * 0.7; 
      const duration = 4 + Math.random() * 5; 

      return {
        id: Math.random() + Date.now() + i,
        startX: `${startX}vw`,
        startY: `${startY}vh`,
        mid1X: `${mid1X}vw`,
        mid1Y: `${mid1Y}vh`,
        mid2X: `${mid2X}vw`,
        mid2Y: `${mid2Y}vh`,
        endX: `${endX}vw`,
        endY: `${endY}vh`,
        startRot: `${startRot}deg`,
        mid1Rot: `${mid1Rot}deg`,
        mid2Rot: `${mid2Rot}deg`,
        endRot: `${endRot}deg`,
        scale,
        duration,
      };
    });

    setFloatingRobots((prev) => [...prev, ...newRobots]);

    // Clean up
    setTimeout(() => {
      setFloatingRobots((prev) => prev.filter((r) => !newRobots.find((nr) => nr.id === r.id)));
    }, 10000);
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] py-10 px-4 relative overflow-hidden font-sans">
      {/* Floating Robot Animations */}
      {floatingRobots.map((robot) => (
        <div
          key={robot.id}
          className="animated-robot flex items-center justify-center bg-[#1D4ED8] border-2 border-[#22D3EE] text-white font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] select-none whitespace-nowrap"
          style={{
            '--start-x': robot.startX,
            '--start-y': robot.startY,
            '--mid1-x': robot.mid1X,
            '--mid1-y': robot.mid1Y,
            '--mid2-x': robot.mid2X,
            '--mid2-y': robot.mid2Y,
            '--end-x': robot.endX,
            '--end-y': robot.endY,
            '--start-rot': robot.startRot,
            '--mid1-rot': robot.mid1Rot,
            '--mid2-rot': robot.mid2Rot,
            '--end-rot': robot.endRot,
            '--scale': robot.scale,
            '--duration': `${robot.duration}s`,
          } as React.CSSProperties}
        >
          🤖 <span className="text-xs ml-1 font-mono tracking-wider bg-[#0891B2] px-1.5 py-0.5 rounded">7632</span>
        </div>
      ))}

      {/* Custom Styles for Robot Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flyRobot {
          0% {
            transform: translate(var(--start-x), var(--start-y)) rotate(var(--start-rot)) scale(var(--scale));
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          33% {
            transform: translate(var(--mid1-x), var(--mid1-y)) rotate(var(--mid1-rot)) scale(var(--scale));
          }
          66% {
            transform: translate(var(--mid2-x), var(--mid2-y)) rotate(var(--mid2-rot)) scale(var(--scale));
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) rotate(var(--end-rot)) scale(var(--scale));
            opacity: 0;
          }
        }
        
        .animated-robot {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          will-change: transform, opacity;
          animation: flyRobot var(--duration) cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}} />

      {/* Gears & Tech Background Vibe elements */}
      <div className="absolute top-8 left-8 text-6xl opacity-10 pointer-events-none select-none animate-spin" style={{ animationDuration: '10s' }}>⚙️</div>
      <div className="absolute top-12 right-12 text-7xl opacity-10 pointer-events-none select-none">⚡</div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-10 pointer-events-none select-none">🔧</div>
      <div className="absolute bottom-12 right-8 text-5xl opacity-10 pointer-events-none select-none">🔋</div>

      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <div 
            className="inline-block bg-[#1E293B] border-4 border-[#06B6D4] rounded-2xl px-6 py-4 shadow-[6px_6px_0px_0px_#0284C7] transform -rotate-1 hover:rotate-1 transition-transform cursor-pointer" 
            onClick={() => spawnRobots(15)}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl animate-bounce">🤖</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#22D3EE] select-none">
                FRC 得分排行榜
              </h1>
              <span className="text-4xl animate-bounce">⚙️</span>
            </div>
            <p className="text-sm font-bold tracking-widest text-[#38BDF8]">FIRST ROBOTICS COMPETITION</p>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-400">
            點擊上方可以召喚 FRC 7632 機器人喔！🤖⚡
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Side: Score Entry Form */}
          <section className="md:col-span-5 bg-[#1E293B] border-4 border-[#475569] rounded-2xl p-5 shadow-[6px_6px_0px_0px_#0369A1]">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2 border-b-2 border-slate-700 pb-2 text-[#38BDF8]">
              <span>📝</span> 登錄比賽得分
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="team-input" className="block text-xs font-black tracking-wider uppercase mb-1 text-slate-300">
                  隊伍編號 / 名稱
                </label>
                <input
                  id="team-input"
                  type="text"
                  placeholder="例如: 7632 (Westport)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={25}
                  disabled={submitting}
                  className="w-full px-3 py-2 border-3 border-[#0284C7] rounded-xl bg-[#0F172A] text-slate-100 focus:border-[#22D3EE] focus:outline-none font-semibold text-sm placeholder-slate-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="score-input" className="block text-xs font-black tracking-wider uppercase mb-1 text-slate-300">
                  聯盟得分 (PTS)
                </label>
                <input
                  id="score-input"
                  type="number"
                  placeholder="例如: 450"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min="0"
                  max="999999"
                  disabled={submitting}
                  className="w-full px-3 py-2 border-3 border-[#0284C7] rounded-xl bg-[#0F172A] text-slate-100 focus:border-[#22D3EE] focus:outline-none font-semibold text-sm placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Status Feedbacks */}
              {error && (
                <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-xl text-red-300 text-xs font-bold flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-cyan-950/80 border-2 border-cyan-500 rounded-xl text-cyan-300 text-xs font-bold flex items-start gap-2 animate-pulse">
                  <span>🎉</span>
                  <span>數據發送成功！機器人已同步！</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#06B6D4] hover:bg-[#0891B2] disabled:bg-cyan-800 text-[#0F172A] font-black rounded-xl border-3 border-[#0F172A] shadow-[3px_3px_0px_0px_#0284C7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#0284C7] transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? '傳送數據中...' : '發送比賽得分 🚀'}
              </button>
            </form>
          </section>

          {/* Right Side: Leaderboard Table */}
          <section className="md:col-span-7 bg-[#1E293B] border-4 border-[#475569] rounded-2xl p-5 shadow-[6px_6px_0px_0px_#0369A1]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-700 pb-2">
              <h2 className="text-xl font-black flex items-center gap-2 text-[#38BDF8]">
                <span>🏆</span> 全球得分榜
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleClearAll}
                  disabled={loading}
                  className="px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border-2 border-red-600 text-red-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  🧹 全部清除
                </button>
                <button
                  onClick={fetchScores}
                  disabled={loading}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border-2 border-[#06B6D4] text-cyan-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {loading ? '更新中...' : '🔄 重新整理'}
                </button>
              </div>
            </div>

            {loading && scores.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-bold flex flex-col items-center gap-2">
                <span className="text-3xl animate-spin">⚙️</span>
                <span>正在同步 FRC 數據...</span>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border-2 border-slate-700">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0F172A] border-b-2 border-slate-700">
                      <th className="py-2 px-3 text-xs font-black text-slate-300 w-16 text-center">排名</th>
                      <th className="py-2 px-3 text-xs font-black text-slate-300">隊伍</th>
                      <th className="py-2 px-3 text-xs font-black text-slate-300 text-right">聯盟得分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((entry, index) => {
                      const isTop3 = index < 3;
                      const medals = ['🥇', '🥈', '🥉'];
                      const rankDisplay = isTop3 ? medals[index] : `${index + 1}`;
                      
                      // Highlight row color
                      let rowBg = 'bg-[#1E293B]';
                      if (index === 0) rowBg = 'bg-[#0E3A5F]/40 hover:bg-[#0E3A5F]/60 border-cyan-800';
                      else if (index === 1) rowBg = 'bg-slate-800/80 hover:bg-slate-800';
                      else if (index === 2) rowBg = 'bg-slate-800/50 hover:bg-slate-800/70';
                      else rowBg = 'hover:bg-slate-800/30';

                      // Format display name locally
                      let displayName = entry.name;
                      if (entry.name.includes('7632')) {
                        displayName = '🤖 7632 (Westport)';
                      } else if (entry.name.includes('254')) {
                        displayName = '🏆 254 (Cheesy Poofs)';
                      } else if (entry.name.includes('1678')) {
                        displayName = '🍊 1678 (Citrus Circuits)';
                      } else if (entry.name.includes('2056')) {
                        displayName = '🦾 2056 (OP Robotics)';
                      }

                      return (
                        <tr
                          key={`${entry.name}-${entry.score}-${entry.date || index}`}
                          className={`${rowBg} border-b border-slate-800 last:border-0 transition-colors`}
                        >
                          <td className="py-2.5 px-3 text-sm font-black text-slate-300 text-center">
                            {rankDisplay}
                          </td>
                          <td className="py-2.5 px-3 text-sm font-bold text-slate-200">
                            <span className="flex items-center gap-1.5">
                              {index === 0 && <span className="text-xs">👑</span>}
                              {displayName}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-sm font-black text-right text-[#22D3EE] tabular-nums">
                            {entry.score.toLocaleString()} PTS
                          </td>
                        </tr>
                      );
                    })}
                    {scores.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-xs font-bold text-slate-500">
                          目前沒有任何比賽得分，快登錄你的隊伍數據吧！🤖
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
              <span>🤖 機器人叮嚀：數據即時同步中 🔋</span>
              <span>參賽隊伍: {scores.length} 支隊伍</span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-xs font-bold text-slate-500 flex flex-col gap-1 items-center justify-center">
          <div className="flex items-center gap-1">
            <span>Made with ⚙️ by Next.js FRC Coach</span>
          </div>
          <span>FRC 排行榜 v2.0.0</span>
        </footer>
      </div>
    </main>
  );
}
