import { useParams } from 'react-router-dom';
import { useDevEmailRawDetail, getAttachmentDownloadUrl } from '@/hooks/api/devemail';
import { EmailNavTabs } from './EmailNavTabs';

export function EmailRawDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useDevEmailRawDetail(id);

  if (!id) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">Ungültige ID</div>
    </div>
  );
  if (isLoading) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">Lade E-Mail…</div>
    </div>
  );
  if (error) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">
        <div className="text-red-600 mb-2">Fehler beim Laden</div>
        <button className="btn btn-sm" onClick={() => refetch()}>Erneut versuchen</button>
      </div>
    </div>
  );

  if (!data) return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4">Keine Daten</div>
    </div>
  );

  return (
    <div>
      <EmailNavTabs active="raw" />
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">{data.subject || '(kein Betreff)'}</h1>
          <div className="text-sm text-gray-600">Von: {data.from} · An: {data.to} · {new Date(data.date).toLocaleString()}</div>
        </div>

        {data.attachments && data.attachments.length > 0 && (
          <div>
            <h2 className="font-medium mb-2">Anhänge</h2>
            <ul className="list-disc pl-6">
              {data.attachments.map((a) => (
                <li key={a.filename}>
                  <a
                    className="text-blue-600 hover:underline"
                    href={getAttachmentDownloadUrl(data.id, a.filename)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {a.filename} {a.size ? `(${Math.round(a.size / 1024)} KB)` : ''}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="font-medium mb-2">Inhalt (RAW)</h2>
          <pre className="bg-gray-50 p-3 rounded border overflow-auto text-sm whitespace-pre-wrap">
{JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default EmailRawDetail;
