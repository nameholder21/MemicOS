'use client';

import { useSession } from 'next-auth/react';
import { ExplanationPartialWithRelations, ExplanationWithPartialRelations } from 'prisma/generated/zod';
import { useEffect, useState } from 'react';
import { useGlobalContext } from './provider/global-provider';
import { Button } from './shadcn/button';

export default function VoteWidget({
  explanation,
  mini,
}: {
  explanation: ExplanationWithPartialRelations | ExplanationPartialWithRelations;
  mini?: boolean;
}) {
  const session = useSession();
  const [userHasUpvoted, setUserHasUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(explanation.votes?.length || 0);
  const { setSignInModalOpen, refreshUser } = useGlobalContext();

  // only check vote once on init
  useEffect(() => {
    if (session.data?.user?.id) {
      explanation.votes?.forEach((vote) => {
        if (vote.voterId === session.data?.user?.id) {
          setUserHasUpvoted(true);
        }
      });
    }
  }, [session]);

  const handleUpvote = () => {
    if (!session.data?.user) {
      setSignInModalOpen(true);
      return;
    }
    if (userHasUpvoted) {
      // unvote
      // assume unvote was correctly processed
      setUserHasUpvoted(false);
      setVoteCount(voteCount - 1);
      fetch(`/api/explanation/${explanation.id}/unvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{}',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(() => {
          console.log('successfully unvoted');
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    } else {
      // vote
      // assume vote was correctly processed
      setUserHasUpvoted(true);
      setVoteCount(voteCount + 1);
      refreshUser();
      fetch(`/api/explanation/${explanation.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{}',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(() => {
          console.log('successfully voted');
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }
  };

  return mini ? (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <h2 className="font-sans text-lg font-medium text-slate-500">{voteCount}</h2>
      {userHasUpvoted ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleUpvote();
          }}
          className="mt-0 whitespace-nowrap rounded bg-amber-400 px-1 py-0.5 text-[10.5px] font-semibold uppercase hover:bg-amber-600 focus:ring-amber-700"
        >
          ▲<span className="font-mono">Voted</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleUpvote();
          }}
          className="mt-0 whitespace-nowrap rounded-md bg-slate-200 px-1.5 py-0.5 text-[10.5px] font-semibold uppercase text-slate-500 hover:bg-amber-300 hover:text-slate-700"
        >
          ▲ <span className="font-mono">Vote</span>
        </button>
      )}
    </div>
  ) : (
    <div className="flex flex-col overflow-hidden rounded-lg">
      <div className="flex flex-row items-center justify-center pb-2">
        <h2 className="font-sans text-3xl font-semibold text-slate-400">{voteCount}</h2>
      </div>
      <div className="flex items-center justify-center">
        {userHasUpvoted ? (
          <Button onClick={handleUpvote} className="w-20">
            ▲ Voted
          </Button>
        ) : (
          <Button onClick={handleUpvote} className="w-20">
            ▲ Vote
          </Button>
        )}
      </div>
    </div>
  );
}
