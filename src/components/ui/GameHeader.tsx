import { useNavigate } from 'react-router-dom';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  onQuit?: () => void;
  rightSlot?: React.ReactNode;
}

export function GameHeader({ title, subtitle, onQuit, rightSlot }: GameHeaderProps) {
  const navigate = useNavigate();

  const handleQuit = () => {
    if (onQuit) {
      onQuit();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
      <div className="flex items-center gap-3">
        <button
          onClick={handleQuit}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded"
          title="Quit to home"
        >
          ✕
        </button>
        <div>
          <h2 className="text-white font-bold text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
        </div>
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </div>
  );
}
