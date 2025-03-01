import { Visibility } from '@prisma/client';

export const getVisibilityBadge = (visibility: Visibility, small: boolean = false) =>
  visibility === Visibility.UNLISTED ? (
    <div
      className={`rounded-full bg-amber-300 ${
        small ? 'px-2 py-0 text-[10px]' : 'px-3 py-1 text-xs'
      } font-bold text-amber-800`}
    >
      Unlisted
    </div>
  ) : visibility === Visibility.PRIVATE ? (
    <div
      className={`rounded-full bg-red-300 ${
        small ? 'px-2 py-0 text-[10px]' : 'px-3 py-1 text-xs'
      } font-bold text-red-800`}
    >
      Private
    </div>
  ) : (
    ''
  );
