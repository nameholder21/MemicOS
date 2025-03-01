// this is the old scorer result that is not currently used
export default function ExplanationScoreDetailOldDialog() {
  return <div>Unused</div>;
  // const {
  //   activationOpen,
  //   setActivationOpen,
  //   activationLoading,
  //   activationExplanation,
  // } = useContext(ExplainModeContext) as ExplainModeContextType;

  // return (
  //   <Dialog.Root open={activationOpen} onOpenChange={setActivationOpen}>
  //     <Dialog.Portal>
  //       <Dialog.Overlay className="fixed inset-0 z-20 animate-fade-up bg-slate-600/40 animate-once animate-ease-in-out"></Dialog.Overlay>
  //       <Dialog.Content className="fixed left-[50%] top-[50%] z-50 flex max-h-[92vh] w-[95vw] max-w-[95vw] translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center rounded-xl bg-slate-50 shadow-xl transition-all focus:outline-none sm:top-[50%] sm:w-[90vw] md:rounded-2xl md:border md:border-slate-200">
  //         {activationLoading ? (
  //           <div className="flex flex-1 flex-col items-center justify-center py-5">
  //             <Dialog.Title className="text-center">
  //               <div className="text-xs font-bold uppercase text-slate-400">
  //                 Loading Score Details
  //               </div>
  //             </Dialog.Title>
  //             <LoadingSpinner size={48} className="text-sky-700" />
  //           </div>
  //         ) : (
  //           <div className="z-50 flex w-full flex-col gap-y-0 overflow-scroll px-3 text-xs">
  //             <div className="top-0 flex flex-col items-center justify-center border-b bg-slate-50 pt-8 sm:sticky">
  //               <div className="flex flex-col sm:hidden">
  //                 <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                   How Scoring Works
  //                 </div>
  //                 <div className="mb-5 text-sm">
  //                   Explanations{" "}
  //                   <a
  //                     href="https://openaipublic.blob.core.windows.net/neuron-explainer/paper/index.html"
  //                     target="_blank"
  //                     rel="noreferrer"
  //                     className="text-sky-600 underline"
  //                   >
  //                     are scored by
  //                   </a>{" "}
  //                   comparing the explanation&#39;s activations (estimated by
  //                   AI) and the actual activations. Good explanations have more
  //                   correlations (green). Click an activation text below for
  //                   more detail.
  //                 </div>
  //               </div>
  //               <div className="mb-4 flex max-w-[900px] flex-row gap-x-4 px-2 text-left text-sm text-slate-600 sm:px-5 sm:text-base">
  //                 {/* <div className="flex flex-col">
  //                   <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                     Author
  //                   </div>
  //                   <div className="">
  //                     {activationExplanation &&
  //                       activationExplanation.author?.name}
  //                   </div>
  //                 </div> */}
  //                 <div className="hidden flex-col sm:flex">
  //                   <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                     How Scoring Works
  //                   </div>
  //                   <div className="text-sm">
  //                     Explanations{" "}
  //                     <a
  //                       href="https://openaipublic.blob.core.windows.net/neuron-explainer/paper/index.html"
  //                       target="_blank"
  //                       rel="noreferrer"
  //                       className="text-sky-600 underline"
  //                     >
  //                       are scored by
  //                     </a>{" "}
  //                     comparing the explanation&#39;s activations (estimated by
  //                     AI) and the actual activations. Good explanations have
  //                     more correlations (green). Click an activation text below
  //                     for more detail.
  //                   </div>
  //                 </div>
  //                 <div className="flex min-w-[250px] flex-col">
  //                   <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                     Explanation
  //                   </div>
  //                   <div className="">{activationExplanation?.description}</div>
  //                 </div>
  //                 <div className="flex flex-col">
  //                   <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                     Score
  //                   </div>
  //                   <div className="">
  //                     {activationExplanation &&
  //                       Math.round(
  //                         (activationExplanation?.scoreV2 ||
  //                           activationExplanation?.scoreV1) * 100,
  //                       )}
  //                   </div>
  //                 </div>
  //                 <div className=" hidden w-64 flex-col sm:flex">
  //                   <div className="mb-1 text-xs font-bold uppercase text-slate-400/80">
  //                     Legend
  //                   </div>
  //                   <div className="flex flex-col gap-y-1 text-sm">
  //                     <div className="whitespace-nowrap bg-blue-100 px-1">
  //                       Blue = Stronger Explanation
  //                     </div>
  //                     <div className="whitespace-nowrap bg-red-100 px-1">
  //                       Red = Stronger Actual
  //                     </div>
  //                     <div className="whitespace-nowrap bg-green-100 px-1">
  //                       Green = Equally Strong
  //                     </div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="py-2 pb-10">
  //               {activationExplanation?.activationsV1?.map(
  //                 (explanationActivation, index) => {
  //                   return explanationActivation.version === SCORER_VERSION &&
  //                     !explanationActivation.scorerId ? (
  //                     <div key={explanationActivation.id} className="">
  //                       {explanationActivation.activation &&
  //                         explanationActivation.expectedValues &&
  //                         explanationActivation.score != undefined && (
  //                           <div className="flex w-full flex-row items-center gap-x-1">
  //                             <div className="flex w-20 flex-col text-center text-base font-bold leading-none text-slate-400">
  //                               {Math.round(explanationActivation.score * 100)}
  //                               <div className="mt-1 text-[9px] font-medium uppercase text-slate-400">
  //                                 Corr
  //                               </div>
  //                               {explanationActivation.scorerAutoInterpModel && (
  //                                 <div className="mt-2 text-[9px] font-medium uppercase text-slate-400">
  //                                   {
  //                                     explanationActivation.scorerAutoInterpModel
  //                                   }
  //                                 </div>
  //                               )}
  //                             </div>
  //                             <div className="flex-1">
  //                               <ExplanationActivationsTokens
  //                                 tokens={
  //                                   explanationActivation.activation.tokens ||
  //                                   []
  //                                 }
  //                                 actual={
  //                                   explanationActivation.activation?.values ||
  //                                   []
  //                                 }
  //                                 simulated={
  //                                   explanationActivation.expectedValues
  //                                 }
  //                               />
  //                             </div>
  //                           </div>
  //                         )}
  //                     </div>
  //                   ) : (
  //                     <></>
  //                   );
  //                 },
  //               )}
  //             </div>
  //             <div className="sticky bottom-0 flex flex-col items-center justify-center border-t bg-slate-50">
  //               <button
  //                 onClick={() => {
  //                   setActivationOpen(false);
  //                 }}
  //                 className="mx-2 my-2 w-full rounded bg-slate-300 px-4 py-3 text-sm font-bold uppercase text-slate-500"
  //               >
  //                 Close
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </Dialog.Content>
  //     </Dialog.Portal>
  //   </Dialog.Root>
  // );
}
