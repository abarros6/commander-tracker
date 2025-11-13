import { formatTime } from '../utils/formatTime';

export default function TimerDisplay({ time, isActive, isLowTime }) {
  return (
    <div className={`text-center ${isActive ? 'text-white' : 'text-gray-300'}`}>
      <div 
        className={`text-5xl font-bold font-mono ${
          isLowTime ? 'text-red-400 animate-pulse' : ''
        }`}
      >
        {formatTime(time)}
      </div>
      {isActive && (
        <div className="text-sm font-semibold text-white mt-1">
          ACTIVE TURN
        </div>
      )}
    </div>
  );
}