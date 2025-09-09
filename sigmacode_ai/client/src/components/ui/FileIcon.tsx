import React from 'react';
import { File as LucideFile } from 'lucide-react';

export type FileIconProps = {
  file?: { filename?: string; type?: string };
  fileType?: { paths?: React.FC; fill?: string; title?: string };
  size?: number;
};

/**
 * Einfache, robuste Datei-Icon-Komponente
 * - Fällt auf Lucide File Icon zurück
 * - Nutzt fileType.fill für Farbe, falls vorhanden
 */
export const FileIcon: React.FC<FileIconProps> = ({ fileType, size = 16 }) => {
  const color = fileType?.fill ?? '#9CA3AF';
  return <LucideFile width={size} height={size} color={color} />;
};

export default FileIcon;
