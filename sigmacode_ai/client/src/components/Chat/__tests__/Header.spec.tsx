import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: () => ({ navVisible: false, setNavVisible: jest.fn() }),
}));

jest.mock('@librechat/client', () => ({
  useMediaQuery: jest.fn(),
}));

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: jest.fn(),
}));

jest.mock('~/hooks', () => ({
  useHasAccess: jest.fn(),
}));

// Mock heavy child components to simple test markers
jest.mock('../Menus/Endpoints/ModelSelector', () => () => (
  <div data-testid="mock-model-selector" />
));

jest.mock('../Menus', () => ({
  PresetsMenu: () => <div data-testid="mock-presets" />,
  HeaderNewChat: () => <button data-testid="mock-new-chat" />,
  OpenSidebar: (props: any) => <button data-testid="mock-open-sidebar" {...props} />,
}));

jest.mock('../ExportAndShareMenu', () => ({
  __esModule: true,
  default: ({ isSharedButtonEnabled }: { isSharedButtonEnabled: boolean }) => (
    <div data-testid="mock-export-share" data-enabled={String(isSharedButtonEnabled)} />
  ),
}));

jest.mock('../Menus/BookmarkMenu', () => () => (
  <div data-testid="mock-bookmark" />
));

jest.mock('../TemporaryChat', () => ({
  TemporaryChat: () => <div data-testid="mock-temp-chat" />,
}));

jest.mock('../AddMultiConvo', () => () => (
  <div data-testid="mock-multi-convo" />
));

jest.mock('../../common/ThemeToggle', () => () => (
  <button data-testid="mock-theme-toggle" />
));

const { useMediaQuery } = jest.requireMock('@librechat/client') as {
  useMediaQuery: jest.Mock;
};
const { useGetStartupConfig } = jest.requireMock('~/data-provider') as {
  useGetStartupConfig: jest.Mock;
};
const { useHasAccess } = jest.requireMock('~/hooks') as {
  useHasAccess: jest.Mock;
};

function setup({
  small = false,
  startupConfig,
  canBookmarks = false,
  canMultiConvo = false,
}: {
  small?: boolean;
  startupConfig?: any;
  canBookmarks?: boolean;
  canMultiConvo?: boolean;
}) {
  useMediaQuery.mockReturnValue(small);
  useGetStartupConfig.mockReturnValue({ data: startupConfig });
  // First call for BOOKMARKS, second call for MULTI_CONVO (according to component order)
  useHasAccess
    .mockReset()
    .mockImplementationOnce(() => canBookmarks)
    .mockImplementationOnce(() => canMultiConvo);

  return render(<Header />);
}

describe('Header', () => {
  it('zeigt Skeleton, solange startupConfig lädt', () => {
    setup({ small: false, startupConfig: undefined });
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
  });

  it('rendert Toolbar, wenn startupConfig geladen ist', () => {
    setup({ small: false, startupConfig: { interface: {}, sharedLinksEnabled: true } });
    expect(screen.getByTestId('header-toolbar')).toBeInTheDocument();
  });

  it('rendert mobile-spezifische Elemente im Small-Screen', () => {
    setup({ small: true, startupConfig: { interface: {}, sharedLinksEnabled: true } });
    expect(screen.getByTestId('header-group-middle')).toBeInTheDocument();
    // In Small-Screen befinden sich Export/Temp/Theme im middle-Block
    expect(screen.getByTestId('mock-export-share')).toBeInTheDocument();
    expect(screen.getByTestId('mock-temp-chat')).toBeInTheDocument();
    expect(screen.getByTestId('mock-theme-toggle')).toBeInTheDocument();
  });

  it('rendert Desktop-spezifische rechte Gruppe, wenn nicht Small-Screen', () => {
    setup({ small: false, startupConfig: { interface: {}, sharedLinksEnabled: false } });
    expect(screen.getByTestId('header-group-right')).toBeInTheDocument();
    const exportShare = screen.getByTestId('mock-export-share');
    expect(exportShare).toBeInTheDocument();
    expect(exportShare).toHaveAttribute('data-enabled', 'false');
  });

  it('beachtet Permissions für Bookmarks und Multi-Convo', () => {
    setup({
      small: false,
      startupConfig: { interface: { presets: true, modelSelect: true }, sharedLinksEnabled: true },
      canBookmarks: true,
      canMultiConvo: false,
    });

    expect(screen.getByTestId('mock-bookmark')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-multi-convo')).not.toBeInTheDocument();
  });
});
