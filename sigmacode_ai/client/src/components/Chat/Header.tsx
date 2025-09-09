import { useMemo } from 'react';
import { useMediaQuery } from '@librechat/client';
import { useOutletContext } from 'react-router-dom';
import { getConfigDefaults, PermissionTypes, Permissions } from 'librechat-data-provider';
import type { ContextType } from '~/common';
import ModelSelector from './Menus/Endpoints/ModelSelector';
import { PresetsMenu, HeaderNewChat, OpenSidebar } from './Menus';
import { useGetStartupConfig } from '~/data-provider';
import ExportAndShareMenu from './ExportAndShareMenu';
import BookmarkMenu from './Menus/BookmarkMenu';
import { TemporaryChat } from './TemporaryChat';
import AddMultiConvo from './AddMultiConvo';
import { useHasAccess } from '~/hooks';
import ThemeToggle from '../common/ThemeToggle';

const defaultInterface = getConfigDefaults().interface;

export default function Header() {
  const { data: startupConfig } = useGetStartupConfig();
  const { navVisible, setNavVisible } = useOutletContext<ContextType>();

  // Memoized interface config to avoid unnecessary re-renders
  const interfaceConfig = useMemo(
    () => startupConfig?.interface ?? defaultInterface,
    [startupConfig],
  );

  const hasAccessToBookmarks = useHasAccess({
    permissionType: PermissionTypes.BOOKMARKS,
    permission: Permissions.USE,
  });

  const hasAccessToMultiConvo = useHasAccess({
    permissionType: PermissionTypes.MULTI_CONVO,
    permission: Permissions.USE,
  });

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const isLoading = !startupConfig;

  // Lightweight header skeleton to avoid layout shift while loading
  const Skeleton = (
    <div
      className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-surface-primary p-2"
      role="toolbar"
      aria-label="Chat Header"
      data-testid="header-skeleton"
    >
      <div className="hide-scrollbar flex w-full items-center justify-between gap-2 overflow-x-auto">
        <div className="mx-1 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-border" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-40 animate-pulse rounded-md bg-border" />
            <div className="h-9 w-24 animate-pulse rounded-md bg-border" />
            <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
            <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-border" />
        </div>
      </div>
      <div />
    </div>
  );

  return (
    <>
      {isLoading ? (
        Skeleton
      ) : (
        <div
          className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-surface-primary p-2 font-semibold text-text-primary"
          role="toolbar"
          aria-label="Chat Header"
          data-testid="header-toolbar"
        >
          <div className="hide-scrollbar flex w-full items-center justify-between gap-2 overflow-x-auto">
            <div className="mx-1 flex items-center gap-2">
              <div
                className={`flex items-center gap-2 ${
                  !isSmallScreen ? 'transition-all duration-200 ease-in-out' : ''
                } ${
                  !navVisible
                    ? 'translate-x-0 opacity-100'
                    : 'pointer-events-none translate-x-[-100px] opacity-0'
                }`}
                role="group"
                aria-label="Navigation und neuer Chat"
                data-testid="header-group-left"
                title="Navigation ein-/ausblenden und neuer Chat"
              >
                <OpenSidebar setNavVisible={setNavVisible} className="max-md:hidden" />
                <HeaderNewChat />
              </div>
              <div
                className={`flex items-center gap-2 ${
                  !isSmallScreen ? 'transition-all duration-200 ease-in-out' : ''
                } ${!navVisible ? 'translate-x-0' : 'translate-x-[-100px]'}`}
                role="group"
                aria-label="Modelle und Aktionen"
                data-testid="header-group-middle"
              >
                <ModelSelector startupConfig={startupConfig} />
                {interfaceConfig.presets === true && interfaceConfig.modelSelect && <PresetsMenu />}
                {hasAccessToBookmarks === true && <BookmarkMenu />}
                {hasAccessToMultiConvo === true && <AddMultiConvo />}
                {isSmallScreen && (
                  <>
                    <ExportAndShareMenu
                      isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false}
                    />
                    <TemporaryChat />
                    <ThemeToggle />
                  </>
                )}
              </div>
            </div>
            {!isSmallScreen && (
              <div
                className="flex items-center gap-2"
                role="group"
                aria-label="Schnelleinstellungen"
                data-testid="header-group-right"
              >
                <ExportAndShareMenu
                  isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false}
                />
                <TemporaryChat />
                <ThemeToggle />
              </div>
            )}
          </div>
          {/* Empty div for spacing */}
          <div />
        </div>
      )}
    </>
  );
}
