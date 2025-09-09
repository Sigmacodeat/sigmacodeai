import React, { memo, useEffect, useMemo, useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import supersub from 'remark-supersub';
import { useRecoilValue } from 'recoil';
import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import type { PluggableList } from 'unified';
import { Citation, CompositeCitation, HighlightedText } from '~/components/Web/Citation';
import { Artifact, artifactPlugin } from '~/components/Artifacts/Artifact';
import { ArtifactProvider, CodeBlockProvider } from '~/Providers';
import MarkdownErrorBoundary from './MarkdownErrorBoundary';
import { langSubset, preprocessLaTeX } from '~/utils';
import { unicodeCitation } from '~/components/Web';
import { code, a, p } from './MarkdownComponents';
import store from '~/store';

type TContentProps = {
  content: string;
  isLatestMessage: boolean;
};

const Markdown = memo(({ content = '', isLatestMessage }: TContentProps) => {
  const LaTeXParsing = useRecoilValue<boolean>(store.LaTeXParsing);
  const isInitializing = content === '';

  const currentContent = useMemo(() => {
    if (isInitializing) {
      return '';
    }
    return LaTeXParsing ? preprocessLaTeX(content) : content;
  }, [content, LaTeXParsing, isInitializing]);

  // Dynamisches Laden schwerer Rehype-Plugins (KaTeX/Highlight) nur bei Bedarf
  const [rehypeKatex, setRehypeKatex] = useState<any | null>(null);
  const [rehypeHighlight, setRehypeHighlight] = useState<any | null>(null);
  const mightContainLatex = useMemo(
    () => /\$(.|\n)*\$|\\\[(.|\n)*\\\]|\\begin\{[^}]+\}/.test(content),
    [content],
  );
  useEffect(() => {
    // Syntax-Highlight wird oft gebraucht, daher lazy aber ohne Bedingung laden
    import('rehype-highlight')
      .then((m) => setRehypeHighlight(m.default ?? m))
      .catch(() => setRehypeHighlight(null));
  }, []);
  useEffect(() => {
    if (!LaTeXParsing && !mightContainLatex) return;
    import('rehype-katex')
      .then((m) => setRehypeKatex(m.default ?? m))
      .catch(() => setRehypeKatex(null));
  }, [LaTeXParsing, mightContainLatex]);

  const rehypePlugins = useMemo(() => {
    const plugins: PluggableList = [];
    if (rehypeKatex) plugins.push([rehypeKatex]);
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

  const remarkPlugins: PluggableList = [
    /** @ts-ignore – plugin type mismatch across unified versions */
    supersub,
    remarkGfm,
    remarkDirective,
    artifactPlugin,
    [remarkMath, { singleDollarTextMath: false }],
    unicodeCitation,
  ];

  if (isInitializing) {
    return (
      <div className="absolute">
        <p className="relative">
          <span className={isLatestMessage ? 'result-thinking' : ''} />
        </p>
      </div>
    );
  }

  return (
    <MarkdownErrorBoundary content={content} codeExecution={true}>
      <ArtifactProvider>
        <CodeBlockProvider>
          <ReactMarkdown
            /** @ts-ignore */
            remarkPlugins={remarkPlugins}
            /* @ts-ignore */
            rehypePlugins={rehypePlugins}
            components={
              {
                code,
                a,
                p,
                artifact: Artifact,
                citation: Citation,
                'highlighted-text': HighlightedText,
                'composite-citation': CompositeCitation,
              } as {
                [nodeType: string]: React.ElementType;
              }
            }
          >
            {currentContent}
          </ReactMarkdown>
        </CodeBlockProvider>
      </ArtifactProvider>
    </MarkdownErrorBoundary>
  );
});

export default Markdown;
