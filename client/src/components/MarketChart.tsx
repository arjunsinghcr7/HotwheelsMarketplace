import React, { useState, useEffect } from 'react';
import { fetchChartData } from '../services/api';

interface MarketChartProps {
  timeframe: '1W' | '1M' | '1Y';
  setTimeframe: (t: '1W' | '1M' | '1Y') => void;
}

export const MarketChart: React.FC<MarketChartProps> = ({
  timeframe,
  setTimeframe,
}) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadChart() {
      try {
        setIsLoading(true);
        const data = await fetchChartData(timeframe);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadChart();
  }, [timeframe]);

  // Generate SVG path coordinates
  const generatePaths = () => {
    if (chartData.length === 0) return { pathD: '', areaD: '', lastY: 0 };
    
    const svgWidth = 400;
    const svgHeight = 100;
    const padding = 15;
    const chartHeight = svgHeight - padding * 2;
    
    const minVal = Math.min(...chartData);
    const maxVal = Math.max(...chartData);
    const range = maxVal - minVal || 1;
    
    const points = chartData.map((val, index) => {
      const x = (index / (chartData.length - 1)) * svgWidth;
      const y = svgHeight - (padding + ((val - minVal) / range) * chartHeight);
      return { x, y };
    });
    
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaD = `${pathD} L 400,100 L 0,100 Z`;
    const lastY = points[points.length - 1].y;

    return { pathD, areaD, lastY };
  };

  const { pathD, areaD, lastY } = generatePaths();

  // X Axis labels based on timeframe
  const getXLabels = () => {
    if (timeframe === '1W') return ['Mon', 'Wed', 'Sun'];
    if (timeframe === '1M') return ['Oct 01', 'Oct 15', 'Oct 30'];
    return ['Jan', 'Jun', 'Dec'];
  };

  const labels = getXLabels();

  return (
    <div className="xl:col-span-2 glass-panel p-md rounded-xl relative h-80 flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <h4 className="text-label-md font-bold uppercase tracking-widest text-on-surface">Market Value Analysis</h4>
        <div className="flex gap-xs">
          {(['1W', '1M', '1Y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-label-sm font-bold transition-all ${
                timeframe === t
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative flex items-end gap-1 px-2">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-label-md text-on-surface-variant">
            Loading market trend...
          </div>
        ) : (
          <>
            {/* Visual SVG line chart */}
            <svg className="absolute inset-0 w-full h-full px-4 pt-4" preserveAspectRatio="none" viewBox="0 0 400 100">
              <path
                d={pathD}
                fill="none"
                stroke="#1565C0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d={areaD}
                fill="url(#blue-grad)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="blue-grad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#1565C0" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              {chartData.length > 0 && (
                <circle cx={400} cy={lastY} fill="#1565C0" r="4" />
              )}
            </svg>
            
            {/* Vertical grid lines helper */}
            <div className="flex-1 border-r border-outline-variant/30 h-full"></div>
            <div className="flex-1 border-r border-outline-variant/30 h-full"></div>
            <div className="flex-1 border-r border-outline-variant/30 h-full"></div>
            <div className="flex-1 border-r border-outline-variant/30 h-full"></div>
          </>
        )}
      </div>
      
      <div className="flex justify-between text-label-sm text-on-surface-variant mt-sm">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
        <span>{labels[2]}</span>
      </div>
    </div>
  );
};
