import { useMemo } from 'react';
import type { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { TooltipAnchor } from '@librechat/client';
import { Menu, MenuButton, MenuItems, Portal } from '@headlessui/react';
import { BookmarkFilledIcon, BookmarkIcon } from '@radix-ui/react-icons';
import { BookmarkContext } from '~/Providers/BookmarkContext';
import { useGetConversationTags } from '~/data-provider';
import BookmarkNavItems from './BookmarkNavItems';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';

type BookmarkNavProps = {
  tags: string[];
  setTags: (tags: string[]) => void;
  isSmallScreen: boolean;
};

const BookmarkNav: FC<BookmarkNavProps> = ({ tags, setTags, isSmallScreen }: BookmarkNavProps) => {
  const localize = useLocalize();
  const { data } = useGetConversationTags();
  const conversation = useRecoilValue(store.conversationByIndex(0));
  const label = useMemo(
    () => (tags.length > 0 ? tags.join(', ') : localize('com_ui_bookmarks')),
    [tags, localize],
  );

  return (
    <Menu as="div" className="group relative">
      {({ open }) => (
        <>
          <TooltipAnchor
            description={label}
            render={
              <MenuButton
                id="bookmark-menu-button"
                aria-label={localize('com_ui_bookmarks')}
                className={cn(
                  'flex items-center justify-center',
                  'size-10 border-none text-text-primary hover:bg-accent hover:text-accent-foreground',
                  'rounded-full border-none p-2 hover:bg-surface-hover md:rounded-xl',
                  open ? 'bg-surface-hover' : '',
                )}
                data-testid="bookmark-menu"
              >
                {tags.length > 0 ? (
                  <BookmarkFilledIcon className="icon-lg text-text-primary" aria-hidden="true" />
                ) : (
                  <BookmarkIcon className="icon-lg text-text-primary" aria-hidden="true" />
                )}
              </MenuButton>
            }
          />
          <Portal>
            <MenuItems
              anchor="bottom start"
              className="z-[1000] mt-1 w-64 max-w-[min(90vw,20rem)] max-h-[70vh] overflow-auto rounded-lg bg-surface-secondary p-1.5 shadow-lg outline-none border border-border/50"
            >
              {data && conversation && (
                <BookmarkContext.Provider value={{ bookmarks: data.filter((tag) => tag.count > 0) }}>
                  <BookmarkNavItems
                    // Currently selected conversation
                    conversation={conversation}
                    // List of selected tags(string)
                    tags={tags}
                    // When a user selects a tag, this `setTags` function is called to refetch the list of conversations for the selected tag
                    setTags={setTags}
                  />
                </BookmarkContext.Provider>
              )}
            </MenuItems>
          </Portal>
        </>
      )}
    </Menu>
  );
};

export default BookmarkNav;
