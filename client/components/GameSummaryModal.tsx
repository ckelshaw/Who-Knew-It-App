import React, { useMemo } from 'react';
import { Game } from '../../shared/classes/Game';
import { User } from '../../shared/classes/User';
import logo from '../src/assets/logo.png';

type GameSummaryModalProps = {
  game: Game;               // <- your full game object
  isOpen: boolean;          // controls visibility
  onClose: () => void;      // close handler
};

const getDisplayName = (u: User) => (u.role === 'host' ? 'The House' : u.concattedName);

const GameSummaryModal: React.FC<GameSummaryModalProps> = ({ game, isOpen, onClose }) => {
  // Sort: non-hosts by score desc, host last
  const rows = useMemo(() => {
    const copy = [...game.contestants];
    copy.sort((a, b) => {
      if (a.role === 'host') return 1;
      if (b.role === 'host') return -1;
      return b.score - a.score;
    });
    return copy;
  }, [game]);

  // Winners (supports ties) — game.winners is User[] | null per your class
  const winners = game.winners ?? [];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-summary-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2
              id="game-summary-title"
              className="text-xl font-semibold text-gray-900"
            >
              Game Summary
            </h2>
            <p className="text-sm text-gray-500">
              {game.name} • {game.game_status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Winners banner */}
        {winners.length > 0 && (
          <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100">
            {winners.length === 1 ? (
              <p className="text-emerald-800 text-sm">
                Winner:{" "}
                <span className="font-medium">
                  {getDisplayName(winners[0])}
                </span>
              </p>
            ) : (
              <p className="text-emerald-800 text-sm">
                Winners (tie):{" "}
                <span className="font-medium">
                  {winners.map(getDisplayName).join(", ")}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Table */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-4">Player</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Correct</th>
                  <th className="py-2 pr-4">Baited</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {rows.map((u) => (
                  <tr
                    key={u.userId}
                    className="border-t last:border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar (initials) */}
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white text-xs">
                          {u.role === "host" ? (
                            <img
                              src={logo}
                              alt="The House"
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                          ) : (
                            u.initials
                          )}
                        </div>
                        <span
                          className={u.role === "host" ? "font-medium" : ""}
                        >
                          {getDisplayName(u)}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4 font-medium">{u.score}</td>
                    <td className="py-2 pr-4">{u.correctGuesses}</td>
                    <td className="py-2 pr-4">{u.answersBaited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {/* Add an export/share button later if you want */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSummaryModal;