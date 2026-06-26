import { differenceInSeconds } from "date-fns";
import { Clock } from "lucide-react";
import { useNow } from "@/hooks/use-now";

interface CountdownTimerProps {
  deadline: string;
  className?: string;
  short?: boolean;
}

export function CountdownTimer({ deadline, className = "", short = false }: CountdownTimerProps) {
  const now = useNow(1000);
  const timeLeft = calculateTimeLeft(deadline, short, now);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {!short && <Clock className="size-3 mr-1" />}
      {timeLeft}
    </span>
  );
}

function calculateTimeLeft(deadline: string, short: boolean, now: number): string {
  const diffInSeconds = differenceInSeconds(new Date(deadline), new Date(now));
  
  if (diffInSeconds <= 0) {
    return short ? "Today" : "Ended";
  }

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  if (short) {
    if (days > 0) return `In ${days}d`;
    if (hours > 0) return `In ${hours}h`;
    if (minutes > 0) return `In ${minutes}m`;
    return `In ${seconds}s`;
  }

  if (days > 7) {
    return `${days}d left`;
  }
  
  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  
  return `${minutes}m ${seconds}s left`;
}
