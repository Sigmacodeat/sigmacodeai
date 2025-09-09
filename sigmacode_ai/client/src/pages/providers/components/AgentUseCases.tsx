import React from 'react';

export interface AgentPattern {
  name: string;
  bestWith: string[];
  pitfalls?: string[];
}

export default function AgentUseCases({ patterns }: { patterns: AgentPattern[] }) {
  if (!Array.isArray(patterns) || patterns.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {patterns.map((ap, idx) => (
        <li key={idx} className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-sm font-medium">{ap.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Am besten mit: {ap.bestWith.join(', ')}</div>
          {Array.isArray(ap.pitfalls) && ap.pitfalls.length > 0 && (
            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">Fallstricke: {ap.pitfalls.join(', ')}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
