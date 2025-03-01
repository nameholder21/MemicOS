'use client';

import { useGlobalContext } from '@/components/provider/global-provider';
import { Neuron } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark as BookmarkLucide } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bookmark } from 'prisma/generated/zod';

export default function BookmarkButton({ mini, currentNeuron }: { mini: boolean; currentNeuron?: Neuron }) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { setSignInModalOpen, showToastMessage } = useGlobalContext();

  // Fetch bookmarks query
  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      if (!session.data?.user) return [];
      const response = await fetch(`/api/user/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      return response.json();
    },
    enabled: !!session.data?.user,
  });

  // Calculate if current neuron is bookmarked
  const bookmarked = currentNeuron
    ? bookmarks.some(
        (b) =>
          b.modelId === currentNeuron.modelId && b.layer === currentNeuron.layer && b.index === currentNeuron.index,
      )
    : false;

  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookmark/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: currentNeuron?.modelId,
          layer: currentNeuron?.layer,
          index: currentNeuron?.index,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      showToastMessage(
        <div className="flex flex-row items-center justify-center gap-2">
          <div>📘 Bookmarked</div>
          <Link
            href={`/user/${session.data?.user?.name}`}
            className="rounded-md bg-sky-600 px-2 py-1.5 text-xs font-semibold uppercase text-sky-100"
          >
            OPEN
          </Link>
        </div>,
      );
    },
    onError: () => {
      showToastMessage(
        <div className="flex flex-row items-center justify-center gap-2">
          <div>Error bookmarking feature.</div>
        </div>,
      );
    },
  });

  // Delete bookmark mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookmark/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: currentNeuron?.modelId,
          layer: currentNeuron?.layer,
          index: currentNeuron?.index,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      showToastMessage(
        <div className="flex flex-row items-center justify-center gap-2">
          <div>👋 Un-Bookmarked</div>
          <Link
            href={`/user/${session.data?.user?.name}`}
            className="rounded-md bg-sky-600 px-2 py-1.5 text-xs font-semibold uppercase text-sky-100"
          >
            OPEN
          </Link>
        </div>,
      );
    },
  });

  const handleBookmarkClick = () => {
    if (!session.data?.user) {
      setSignInModalOpen(true);
      return;
    }

    if (bookmarked) {
      deleteBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  return mini ? (
    <button
      type="button"
      onClick={handleBookmarkClick}
      id="bookmarkButton"
      className={`${
        bookmarked
          ? 'bg-sky-700 text-white hover:bg-sky-800'
          : 'bg-slate-500 text-slate-700 hover:enabled:bg-sky-300 hover:enabled:text-sky-800 disabled:bg-slate-400 disabled:opacity-60'
      } w-12 overflow-hidden rounded-lg px-0 py-1.5 text-center text-xs font-bold uppercase transition-all `}
    >
      {bookmarked ? (
        <div className="-mt-0.5 flex flex-row items-center justify-center">
          <BookmarkLucide className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      ) : (
        <div className="-mt-0.5 flex flex-row items-center justify-center">
          <BookmarkLucide className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      )}
    </button>
  ) : (
    <button
      type="button"
      onClick={handleBookmarkClick}
      id="bookmarkButton"
      disabled={!currentNeuron}
      className={`${
        bookmarked
          ? 'bg-sky-700 text-white hover:bg-sky-800'
          : 'bg-slate-200 text-slate-500/80  hover:enabled:bg-sky-300 hover:enabled:text-sky-800 disabled:bg-slate-400 disabled:opacity-60'
      } h-9 w-9 overflow-hidden rounded-full px-0 py-1.5 text-center text-xs font-bold uppercase transition-all`}
    >
      {bookmarked ? (
        <div className="flex flex-row items-center justify-center">
          <BookmarkLucide className="h-5 w-5" />
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center">
          <BookmarkLucide className="h-5 w-5" />
        </div>
      )}
    </button>
  );
}
