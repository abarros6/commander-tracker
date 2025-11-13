import { useRef, useEffect } from 'react';

export const useTimer = (isRunning, activePlayer, players, setPlayers) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && activePlayer !== null) {
      intervalRef.current = setInterval(() => {
        setPlayers(prevPlayers => 
          prevPlayers.map((player, index) => {
            if (index === activePlayer && player.time > 0) {
              return { ...player, time: player.time - 1 };
            }
            return player;
          })
        );
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activePlayer, setPlayers]);

  return intervalRef.current;
};