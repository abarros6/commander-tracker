import { Minus, Plus } from 'lucide-react';

export default function LifeCounter({ life, onLifeChange, playerColor }) {
  const adjustLife = (amount) => {
    onLifeChange(life + amount);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => adjustLife(-5)}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-lg touch-manipulation"
        >
          -5
        </button>
        <button 
          onClick={() => adjustLife(-1)}
          className="w-12 h-12 bg-red-400 hover:bg-red-500 text-white rounded-lg flex items-center justify-center touch-manipulation"
        >
          <Minus size={20} />
        </button>
        <div className={`text-4xl font-bold px-4 py-2 min-w-[80px] text-center ${
          life <= 0 ? 'text-red-400' : 'text-white'
        }`}>
          {life}
        </div>
        <button 
          onClick={() => adjustLife(1)}
          className="w-12 h-12 bg-green-400 hover:bg-green-500 text-white rounded-lg flex items-center justify-center touch-manipulation"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={() => adjustLife(5)}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-lg touch-manipulation"
        >
          +5
        </button>
      </div>
      {life <= 0 && (
        <div className="text-red-400 font-bold text-sm">
          ELIMINATED
        </div>
      )}
    </div>
  );
}