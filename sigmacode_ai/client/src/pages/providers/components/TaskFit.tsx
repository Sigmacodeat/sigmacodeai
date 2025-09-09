import React from 'react';

export interface TaskFitItem {
  type: string;
  recommendedModels: string[];
  notes?: string;
}

export default function TaskFit({ tasks }: { tasks: TaskFitItem[] }) {
  if (!Array.isArray(tasks) || tasks.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {tasks.map((tItem, idx) => (
        <li key={idx} className="rounded-md border border-gray-200 dark:border-gray-800 p-3">
          <div className="text-sm font-medium">{tItem.type}</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">
            Empfohlen: {tItem.recommendedModels.join(', ')}
          </div>
          {tItem.notes && <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">{tItem.notes}</div>}
        </li>
      ))}
    </ul>
  );
}
