'use client';

import { CommentWithPartialRelations } from 'prisma/generated/zod';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useFeatureContext } from './feature-provider';
import { useGlobalContext } from './global-provider';
import createContextWrapper from './provider-util';

export const [CommentContext, useCommentContext] = createContextWrapper<{
  comments: CommentWithPartialRelations[];
  setComments: (comments: CommentWithPartialRelations[]) => void;
  submitComment: (text: string, modelId: string, layer: string, index: string) => Promise<void>;
  isSubmittingComment: boolean;
  setIsSubmittingComment: (bool: boolean) => void;
  deleteComment: (id: string, deleteText: string) => void;
}>('CommentContext');

export default function CommentProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<CommentWithPartialRelations[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { currentFeature: currentNeuron } = useFeatureContext();
  const { user } = useGlobalContext();

  useEffect(() => {
    if (currentNeuron && currentNeuron.comments) {
      currentNeuron.comments = comments;
    }
  }, [comments]);

  const submitComment = (text: string, modelId: string, layer: string, index: string) => {
    setIsSubmittingComment(true);
    return fetch(`/api/comment/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        modelId,
        layer,
        index,
      }),
    })
      .then((response) => {
        setIsSubmittingComment(false);
        return response.json();
      })
      .then((newComment: CommentWithPartialRelations) => {
        setComments([...comments, { ...newComment, user }]);
      })
      .catch((error) => {
        alert(error);
        setIsSubmittingComment(false);
      });
  };

  const deleteComment = (id: string, deleteText: string) => {
    if (window.confirm(`Are you sure you want to delete this comment?\n\n"${deleteText}"`)) {
      fetch(`/api/comment/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setComments(comments.filter((item) => item.id !== id));
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const contextValue = useMemo(
    () => ({
      comments,
      setComments,
      submitComment,
      deleteComment,
      isSubmittingComment,
      setIsSubmittingComment,
    }),
    [comments, submitComment, deleteComment, isSubmittingComment],
  );

  return <CommentContext.Provider value={contextValue}>{children}</CommentContext.Provider>;
}
