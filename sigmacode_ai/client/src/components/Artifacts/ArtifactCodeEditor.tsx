// Minimaler lokaler Typ für die sandpack.files Einträge, wir nutzen nur das 'code'-Feld
type SandpackBundlerFileMinimal = { code: string };
import debounce from 'lodash/debounce';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
// Dynamisches Lazy-Loading von Sandpack, um Initial-Bundle zu entlasten
type SandpackModule = {
  SandpackProvider: React.ComponentType<any>;
  SandpackCodeEditor: React.ForwardRefExoticComponent<any>;
  useSandpack: () => { sandpack: { files: Record<string, unknown> } };
};
type SandpackProviderProps = {
  template?: string;
  files?: Record<string, unknown>;
  options?: Record<string, unknown>;
  theme?: string;
  children?: React.ReactNode;
};
type CodeEditorRef = unknown;
import type { ArtifactFiles, Artifact } from '~/common';
import { useEditArtifact, useGetStartupConfig } from '~/data-provider';
import { useEditorContext, useArtifactsContext } from '~/Providers';
import { sharedFiles, sharedOptions } from '~/utils/artifacts';

const createDebouncedMutation = (
  callback: (params: {
    index: number;
    messageId: string;
    original: string;
    updated: string;
  }) => void,
) => debounce(callback, 500);

const CodeEditor = ({
  fileKey,
  readOnly,
  artifact,
  editorRef,
  sandpackMod,
}: {
  fileKey: string;
  readOnly?: boolean;
  artifact: Artifact;
  editorRef: React.MutableRefObject<CodeEditorRef>;
  sandpackMod: SandpackModule;
}) => {
  const { sandpack } = sandpackMod.useSandpack();
  const [currentUpdate, setCurrentUpdate] = useState<string | null>(null);
  const { isMutating, setIsMutating, setCurrentCode } = useEditorContext();
  const editArtifact = useEditArtifact({
    onMutate: (vars) => {
      setIsMutating(true);
      setCurrentUpdate(vars.updated);
    },
    onSuccess: () => {
      setIsMutating(false);
      setCurrentUpdate(null);
    },
    onError: () => {
      setIsMutating(false);
    },
  });

  const mutationCallback = useCallback(
    (params: { index: number; messageId: string; original: string; updated: string }) => {
      editArtifact.mutate(params);
    },
    [editArtifact],
  );

  const debouncedMutation = useMemo(
    () => createDebouncedMutation(mutationCallback),
    [mutationCallback],
  );

  useEffect(() => {
    if (readOnly) {
      return;
    }
    if (isMutating) {
      return;
    }
    if (artifact.index == null) {
      return;
    }

    const currentCode = (sandpack.files['/' + fileKey] as SandpackBundlerFileMinimal | undefined)?.code;
    const isNotOriginal =
      currentCode && artifact.content != null && currentCode.trim() !== artifact.content.trim();
    const isNotRepeated =
      currentUpdate == null
        ? true
        : currentCode != null && currentCode.trim() !== currentUpdate.trim();

    if (artifact.content && isNotOriginal && isNotRepeated) {
      setCurrentCode(currentCode);
      debouncedMutation({
        index: artifact.index,
        messageId: artifact.messageId ?? '',
        original: artifact.content,
        updated: currentCode,
      });
    }

    return () => {
      debouncedMutation.cancel();
    };
  }, [
    fileKey,
    artifact.index,
    artifact.content,
    artifact.messageId,
    readOnly,
    isMutating,
    currentUpdate,
    setIsMutating,
    sandpack.files,
    setCurrentCode,
    debouncedMutation,
  ]);

  return (
    <sandpackMod.SandpackCodeEditor
      ref={editorRef}
      showTabs={false}
      showRunButton={false}
      showLineNumbers={true}
      showInlineErrors={true}
      readOnly={readOnly === true}
      className="hljs language-javascript bg-black"
    />
  );
};

export const ArtifactCodeEditor = function ({
  files,
  fileKey,
  template,
  artifact,
  editorRef,
  sharedProps,
}: {
  fileKey: string;
  artifact: Artifact;
  files: ArtifactFiles;
  template: string | undefined;
  sharedProps: unknown;
  editorRef: React.MutableRefObject<CodeEditorRef>;
}) {
  const { data: config } = useGetStartupConfig();
  const { isSubmitting } = useArtifactsContext();
  const options: typeof sharedOptions = useMemo(() => {
    if (!config) {
      return sharedOptions;
    }
    return {
      ...sharedOptions,
      bundlerURL: template === 'static' ? config.staticBundlerURL : config.bundlerURL,
    };
  }, [config, template]);
  const [readOnly, setReadOnly] = useState(isSubmitting ?? false);
  useEffect(() => {
    setReadOnly(isSubmitting ?? false);
  }, [isSubmitting]);

  // Lazy-load Sandpack-Module
  const [sandpackMod, setSandpackMod] = useState<SandpackModule | null>(null);
  useEffect(() => {
    let active = true;
    import('@codesandbox/sandpack-react')
      .then((m) => {
        if (!active) return;
        const mod: SandpackModule = {
          SandpackProvider: (m as any).SandpackProvider ?? (m as any).default?.SandpackProvider ?? (m as any).StyledProvider ?? (m as any),
          SandpackCodeEditor: (m as any).SandpackCodeEditor,
          useSandpack: (m as any).useSandpack,
        };
        setSandpackMod(mod);
      })
      .catch(() => setSandpackMod(null));
    return () => {
      active = false;
    };
  }, []);

  if (Object.keys(files).length === 0) {
    return null;
  }

  if (!sandpackMod) {
    return (
      <div className="w-full h-full min-h-[240px] rounded-md bg-neutral-900/60 text-neutral-300 grid place-items-center text-sm">
        Editor wird geladen …
      </div>
    );
  }

  const StyledProvider = sandpackMod.SandpackProvider as React.ComponentType<SandpackProviderProps>;
  return (
    <StyledProvider
      theme="dark"
      files={{
        ...files,
        ...sharedFiles,
      }}
      options={options as unknown as Record<string, unknown>}
      {...(sharedProps as Record<string, unknown>)}
      template={template}
    >
      <CodeEditor
        sandpackMod={sandpackMod}
        fileKey={fileKey}
        artifact={artifact}
        editorRef={editorRef}
        readOnly={readOnly}
      />
    </StyledProvider>
  );
};
