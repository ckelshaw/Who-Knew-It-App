import React from 'react';
import { User } from "../../shared/classes/User";

type ContestantLink = {
    name?: string;
    userId: string;
    gameId: string;
}

type CPProps = {
    contestants: User[];
    gameId: string;
}


const ContestestantPaths = ({ contestants, gameId }: CPProps) => {

console.log("Contestants: ", contestants);
    return (
      <>
        <div
          className={`w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900`}
          role="group"
          aria-label="Invite links"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contestant Links
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Copy and send these URLs to your contestants.
              </p>
            </div>
            {/* <button
              className="inline-flex items-center rounded-xl border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Copy all links"
            >
              Copy All
              <span className="ml-2 text-xs opacity-70">
                {copiedKey === "copy-all" ? "✓" : "⧉"}
              </span>
            </button> */}
          </div>

          <ul className="space-y-3">
            {contestants.map((c) => (
              <li
                key={c.userId}
                className="rounded-xl bg-gray-50 p-3 ring-1 ring-inset ring-gray-200 dark:bg-gray-800/60 dark:ring-gray-700"
              >
                <div className="mb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {c.concattedName}
                </div>
                <div className="mb-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    localhost:5173/contestant/{gameId}/{c.userId}
                </div>
                {/* <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={r.url}
                    className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 font-mono text-xs text-gray-800 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    aria-label={`${r.label} URL`}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <button
                    onClick={() => copyText(r.url, r.key)}
                    className="shrink-0 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 active:scale-[0.98] dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    aria-label={`Copy ${r.label}`}
                    title="Copy"
                  >
                    {copiedKey === r.key ? "Copied ✓" : "Copy"}
                  </button>
                </div> */}
              </li>
            ))}
          </ul>

          {/* <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-200 dark:bg-yellow-900/20 dark:text-yellow-100 dark:ring-yellow-800">
            Tip: The generic join link lets anyone enter a name and join the
            game. The per-contestant links include a secure token for a specific
            player (
            <code className="font-mono">/join/{gameId}/&lt;token&gt;</code>).
          </div> */}
        </div>
      </>
    );
}

export default ContestestantPaths;