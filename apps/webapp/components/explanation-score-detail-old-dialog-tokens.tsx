// this is the old scorer result that is not currently used

// import { LINE_BREAK_REPLACEMENT_CHAR } from '@/lib/utils/activations';
// import * as Tooltip from '@radix-ui/react-tooltip';
// import { useState } from 'react';

// function makeActivationBackgroundColor(
//   overallMaxValue: number,
//   value: number,
//   rgb: string = '52, 211, 153', // emerald-400 #34d399
//   dfaValue?: number | undefined,
// ) {
//   // if dfa value stronger, then use dfavalue
//   if (dfaValue && dfaValue > value) {
//     rgb = '251, 146, 60'; // orange-400 #fb923c
//     value = dfaValue;
//   }

//   const realMax = overallMaxValue;
//   const realCurrent = value;
//   const ratio = realCurrent / realMax;
//   if (ratio === 0) {
//     var opacity = 0;
//   } else {
//     // const opacity =
//     //   realCurrent > 0
//     //     ? Math.max(realCurrent / realMax, 0.35)
//     //     : realCurrent / realMax;
//     const minOpacity = 0.3;
//     const scale = 1 - minOpacity; // Maximum scale adjustment to reach 1

//     // Adjust value to start scaling from 0.3 upwards
//     // We use a logarithmic function to scale the value.
//     // The constants 9 and 0.1 are chosen to make the function start at 0.3 for very small values
//     // and approach 1 as the value approaches 1.
//     var opacity = minOpacity + (Math.log10(1 + 9 * ratio) * scale) / Math.log10(10);
//     // Ensure the opacity does not exceed 1
//     opacity = Math.min(opacity, 1);
//   }

//   return `rgba(${rgb}, ${opacity})`;
// }

export default function ExplanationScoreDetailOldDialogTokens() {
  return <div>Unused</div>;
  // const maxActual = Math.max(...actual);
  // const maxSimulated = Math.max(...simulated);

  // const [showDetails, setShowDetails] = useState(false);

  // function replaceUnknownTokenAndLineBreaks(token: string, tokenIndex: number) {
  //   return token === '\n' ? <>{LINE_BREAK_REPLACEMENT_CHAR}</> : token;
  // }

  // /*
  // TODO: this sucks and should be improved
  //   simulated: 1, 0.5, 0
  //   actual: 0, 1, 2
  //   correctedSimulated: 1, 0.5, 0, 0
  //   correctedActual: 0, 0.5, 1, 0
  //   red = correctedSimulated > correctedActual
  //   green = equal, scaled by value
  //   blue = correctedSimulated < correctedActual
  //   combined correct result: red (255, 0, 0), half-green (0, 128, 0), blue (0,0,255), white (255,255,255)
  //   correct result non-adjusted: red (1,0,0), half-green (0, 0.5, 0), blue (0,0, 1), white (1,1,1)
  // */

  // function makeBackgroundColor(simulatedScore: number, actualScore: number) {
  //   var correctedSimulated = 0;
  //   if (maxSimulated !== 0) {
  //     correctedSimulated = simulatedScore / maxSimulated;
  //   }
  //   var correctedActual = 0;
  //   if (maxActual !== 0) {
  //     correctedActual = actualScore / maxActual;
  //   }

  //   var amountMatch = 1 - Math.abs(correctedSimulated - correctedActual);

  //   var red = (1 - (correctedSimulated - correctedActual + amountMatch)) * 255;
  //   var green = (1 - Math.abs(correctedSimulated - correctedActual)) * correctedSimulated * 255;
  //   var blue = (1 - (correctedActual - correctedSimulated + amountMatch)) * 255;

  //   var multiplyOpacityBy = correctedSimulated > correctedActual ? correctedSimulated : correctedActual;
  //   return `rgba(${red}, ${green}, ${blue}, ${amountMatch * multiplyOpacityBy})`;
  // }

  // return (
  //   <div
  //     className={`flex flex-col border px-2 py-2 text-xs sm:text-base ${
  //       showDetails ? 'my-4 rounded-md border-slate-300' : 'border-transparent'
  //     }`}
  //     onClick={() => {
  //       setShowDetails(!showDetails);
  //     }}
  //   >
  //     {showDetails && (
  //       <div className="mb-0.5 text-left text-xs font-bold text-slate-400/70">Combined Explanation and Actual</div>
  //     )}
  //     <div>
  //       {tokens.map((token, tokenIndex) => {
  //         return (
  //           <Tooltip.Provider key={tokenIndex} delayDuration={0} skipDelayDuration={0}>
  //             <Tooltip.Root delayDuration={0}>
  //               <Tooltip.Trigger asChild>
  //                 <span
  //                   style={{
  //                     backgroundColor: makeBackgroundColor(simulated[tokenIndex], actual[tokenIndex]),
  //                   }}
  //                   className="cursor-pointer text-slate-700"
  //                 >
  //                   {replaceUnknownTokenAndLineBreaks(token, tokenIndex)}
  //                 </span>
  //               </Tooltip.Trigger>
  //               <Tooltip.Portal>
  //                 <Tooltip.Content
  //                   className="z-50 rounded-xl bg-amber-100 px-4 py-2 text-center text-base font-semibold text-slate-700"
  //                   sideOffset={3}
  //                 >
  //                   &quot;{token}&quot;
  //                   <div className="flex w-full flex-col text-sm font-bold">
  //                     <div className="flex flex-row">
  //                       <div className="flex-1 text-blue-500">Explanation</div>
  //                       <div className="w-12">
  //                         {maxSimulated !== 0 ? Math.round((simulated[tokenIndex] / maxSimulated) * 100) : ''}
  //                       </div>
  //                     </div>
  //                     <div className="flex flex-row">
  //                       <div className="flex-1 text-red-500">Actual</div>
  //                       <div className="w-12">
  //                         {maxActual !== 0 ? Math.round((actual[tokenIndex] / maxActual) * 100) : ''}
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </Tooltip.Content>
  //               </Tooltip.Portal>
  //             </Tooltip.Root>
  //           </Tooltip.Provider>
  //         );
  //       })}
  //     </div>
  //     {showDetails && (
  //       <div className="mt-5 flex flex-col gap-y-5 rounded-lg text-xs text-slate-700 sm:text-base">
  //         <div className="">
  //           <div className="mb-0.5 text-left text-xs font-bold text-slate-400/70">Explanation Activations</div>
  //           {tokens.map((token, tokenIndex) => {
  //             return (
  //               <span
  //                 key={tokenIndex}
  //                 style={{
  //                   backgroundColor: makeActivationBackgroundColor(maxSimulated, simulated[tokenIndex], '165,180,252'),
  //                 }}
  //               >
  //                 {replaceUnknownTokenAndLineBreaks(token, tokenIndex)}
  //               </span>
  //             );
  //           })}
  //         </div>
  //         <div>
  //           <div className="mb-0.5 text-left text-xs font-bold text-slate-400/70">Actual Activations</div>
  //           {tokens.map((token, tokenIndex) => {
  //             return (
  //               <span
  //                 key={tokenIndex}
  //                 style={{
  //                   backgroundColor: makeActivationBackgroundColor(maxActual, actual[tokenIndex], '253,164,175'),
  //                 }}
  //               >
  //                 {replaceUnknownTokenAndLineBreaks(token, tokenIndex)}
  //               </span>
  //             );
  //           })}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}
