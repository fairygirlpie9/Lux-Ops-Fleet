import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded text-charcoal border border-transparent">
      <Clock size={14} className="text-secondary" />
      <span className="text-xs font-medium font-mono">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="text-[10px] text-secondary border-l border-gray-300 pl-1.5 ml-0.5">
         {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
};