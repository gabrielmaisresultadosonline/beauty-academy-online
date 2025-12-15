import { useState, useEffect } from 'react';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 48, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          return { hours: 48, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-bold text-primary font-heading">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Horas</span>
      </div>
      <span className="text-3xl font-bold text-primary">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-bold text-primary font-heading">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Min</span>
      </div>
      <span className="text-3xl font-bold text-primary">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-bold text-primary font-heading">
          {formatNumber(timeLeft.seconds)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Seg</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
