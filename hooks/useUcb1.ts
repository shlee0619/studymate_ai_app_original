import { useCallback, useEffect, useRef } from 'react';

interface Ucb1Controller {
  selectArm: () => number;
  update: (arm: number, reward: number) => void;
}

export const useUcb1 = (numArms: number): Ucb1Controller => {
  const pullsRef = useRef<number[]>(new Array(numArms).fill(0));
  const rewardsRef = useRef<number[]>(new Array(numArms).fill(0));
  const totalPullsRef = useRef(0);

  useEffect(() => {
    pullsRef.current = new Array(numArms).fill(0);
    rewardsRef.current = new Array(numArms).fill(0);
    totalPullsRef.current = 0;
  }, [numArms]);

  const selectArm = useCallback((): number => {
    for (let arm = 0; arm < numArms; arm++) {
      if (pullsRef.current[arm] === 0) {
        return arm;
      }
    }

    let maxUcb = -Infinity;
    let bestArm = 0;
    for (let arm = 0; arm < numArms; arm++) {
      const averageReward = rewardsRef.current[arm] / pullsRef.current[arm];
      const explorationBonus = Math.sqrt((2 * Math.log(totalPullsRef.current)) / pullsRef.current[arm]);
      const ucbScore = averageReward + explorationBonus;
      if (ucbScore > maxUcb) {
        maxUcb = ucbScore;
        bestArm = arm;
      }
    }
    return bestArm;
  }, [numArms]);

  const update = useCallback((arm: number, reward: number) => {
    pullsRef.current[arm] += 1;
    rewardsRef.current[arm] += reward;
    totalPullsRef.current += 1;
  }, []);

  return { selectArm, update };
};
