import { memo, useEffect, useMemo, useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import supersub from 'remark-supersub';
import ReactMarkdown from 'react-markdown';
import type { PluggableList } from 'unified';
import { code, codeNoExecution, a, p } from './MarkdownComponents';
import { CodeBlockProvider, ArtifactProvider } from '~/Providers';
import MarkdownErrorBoundary from './MarkdownErrorBoundary';
import { langSubset } from '~/utils';

const MarkdownLite = memo(
  ({ content = '', codeExecution = true }: { content?: string; codeExecution?: boolean }) => {
    // Lazy-load rehype plugins only when component is used
    const [rehypeKatex, setRehypeKatex] = useState<any | null>(null);
    const [rehypeHighlight, setRehypeHighlight] = useState<any | null>(null);
    useEffect(() => {
      import('rehype-highlight')
        .then((m) => setRehypeHighlight(m.default ?? m))
        .catch(() => setRehypeHighlight(null));
      import('rehype-katex')
        .then((m) => setRehypeKatex(m.default ?? m))
        .catch(() => setRehypeKatex(null));
    }, []);

    const rehypePlugins: PluggableList = useMemo(() => {
      const plugins: PluggableList = [];
      if (rehypeKatex) plugins.push([rehypeKatex as any]);
      if (rehypeHighlight)
        plugins.push([
          rehypeHighlight as any,
          {
            detect: true,
            ignoreMissing: true,
            subset: langSubset,
          },
        ]);
      return plugins;
    }, [rehypeKatex, rehypeHighlight]);

    return (
      <MarkdownErrorBoundary content={content} codeExecution={codeExecution}>
        <ArtifactProvider>
          <CodeBlockProvider>
            <ReactMarkdown
              remarkPlugins={[
                /** @ts-ignore */
                supersub,
                remarkGfm,
                [remarkMath, { singleDollarTextMath: false }],
              ]}
              /** @ts-ignore */
              rehypePlugins={rehypePlugins}
              // linkTarget="_new"
              components={
                {
                  code: codeExecution ? code : codeNoExecution,
                  a,
                  p,
                } as {
                  [nodeType: string]: React.ElementType;
                }
              }
            >
              {content}
            </ReactMarkdown>
          </CodeBlockProvider>
        </ArtifactProvider>
      </MarkdownErrorBoundary>
    );
  },
);

export default MarkdownLite;
