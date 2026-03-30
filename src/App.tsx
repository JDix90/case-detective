import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './screens/home/HomeScreen';
import { SettingsScreen } from './screens/home/SettingsScreen';
import { LearnScreen } from './screens/learn/LearnScreen';
import { PracticeScreen } from './screens/practice/PracticeScreen';
import { SpeedScreen } from './screens/speed/SpeedScreen';
import { BossScreen } from './screens/boss/BossScreen';
import { MemoryScreen } from './screens/memory/MemoryScreen';
import { GridScreen } from './screens/grid/GridScreen';
import { ResultsScreen } from './screens/results/ResultsScreen';

export default function App() {
  const { init } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/learn" element={<LearnScreen />} />
        <Route path="/practice" element={<PracticeScreen />} />
        <Route path="/speed" element={<SpeedScreen />} />
        <Route path="/boss" element={<BossScreen />} />
        <Route path="/memory" element={<MemoryScreen />} />
        <Route path="/grid" element={<GridScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
