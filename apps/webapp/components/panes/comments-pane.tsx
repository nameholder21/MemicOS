'use client';

import { useCommentContext } from '@/components/provider/comment-provider';
import { useGlobalContext } from '@/components/provider/global-provider';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CommentWithPartialRelations, NeuronWithPartialRelations } from 'prisma/generated/zod';
import { useEffect, useState } from 'react';

export default function CommentsPane({
  initialComments,
  neuron,
}: {
  initialComments: CommentWithPartialRelations[];
  neuron: NeuronWithPartialRelations | undefined;
}) {
  const session = useSession();
  const { setSignInModalOpen } = useGlobalContext();
  const { comments, setComments, submitComment, isSubmittingComment, deleteComment } = useCommentContext();
  const [newCommentText, setNewCommentText] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments, setComments]);

  function submitClicked() {
    if (!session.data?.user) {
      setSignInModalOpen(true);
      return;
    }
    setNewCommentText(newCommentText.trim());
    if (newCommentText.length < 5) {
      alert('Comment too short. Minimum length 5 characters.');
      return;
    }
    if (newCommentText.length > 1024) {
      alert('Comment too long. Maximum length 1024 characters.');
      return;
    }
    if (neuron) {
      submitComment(newCommentText, neuron.modelId, neuron.layer, neuron.index).then(() => {
        setNewCommentText('');
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-lg rounded-t-none  bg-white">
      {comments.length === 0 ? (
        <div>
          <div className="flex h-16 w-full flex-col items-center justify-center">
            <h1 className="text-sm font-bold text-slate-300">No Comments</h1>
          </div>
        </div>
      ) : (
        <div className="px-1 py-2.5 text-left">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="relative grid-cols-[auto_1fr] gap-1.5 py-1 pl-3 pr-6 text-sm leading-tight text-slate-600"
            >
              <Link
                className=" whitespace-nowrap text-xs font-semibold text-slate-400/70 hover:text-sky-500"
                href={`/user/${comment.user?.name}`}
                prefetch={false}
              >
                {comment.user?.name}
              </Link>
              <div className="text-[13px]">{comment.text}</div>
              {comment.user?.name === (session.data?.user?.name || 'notmatch') && (
                <X
                  className="absolute right-2 top-1 h-3 w-3 cursor-pointer text-slate-300 hover:text-red-500"
                  strokeWidth={3}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteComment(comment.id, comment.text);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
      <div className="px-2 pb-2 pt-0">
        <div className="flex w-full flex-row gap-0" id="submitCommentFieldAndButton">
          <label htmlFor="commentText" className="mt-0 grow" aria-label="Add Comment">
            <input
              id="commentText"
              name="commentText"
              value={newCommentText}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  submitClicked();
                }
              }}
              onChange={(e) => {
                setNewCommentText(e.target.value);
                if (e.target.value.length > 0) {
                  setShowSubmit(true);
                } else {
                  setShowSubmit(false);
                }
              }}
              required
              className={`text-left ${
                showSubmit ? 'rounded-l-md' : 'rounded-md'
              } form-input mt-0 block w-full border-0 bg-slate-200 px-2 py-2 text-xs font-normal text-slate-700 placeholder-slate-700/60 focus:outline-none focus:ring-0 sm:py-2`}
              placeholder="Add Comment"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmittingComment}
            onClick={() => {
              submitClicked();
            }}
            className={`${
              showSubmit ? 'px-2 sm:px-3' : 'w-0 px-0'
            } font-semi overflow-hidden rounded-r-md bg-slate-400 font-mono text-xs font-semibold uppercase text-white transition-all hover:bg-slate-300 hover:text-slate-700 focus:ring-0 disabled:bg-slate-300 disabled:text-slate-400`}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
