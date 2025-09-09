import React from 'react';

export interface ModelInfo {
  name: string;
  contextWindow?: number;
  supportsTools?: boolean;
  strengths?: string[];
}

export default function ModelMatrix({ models }: { models: ModelInfo[] }) {
  if (!Array.isArray(models) || models.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200 dark:border-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="text-left p-2">Modell</th>
            <th className="text-left p-2">Kontext</th>
            <th className="text-left p-2">Tools</th>
            <th className="text-left p-2">Stärken</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.name} className="border-t border-gray-200 dark:border-gray-800">
              <td className="p-2 font-medium">{m.name}</td>
              <td className="p-2">{m.contextWindow ? `${m.contextWindow.toLocaleString()} tokens` : '—'}</td>
              <td className="p-2">{m.supportsTools ? 'Ja' : 'Nein'}</td>
              <td className="p-2">{Array.isArray(m.strengths) ? m.strengths.join(', ') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
