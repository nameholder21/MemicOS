import BreadcrumbsComponent from '@/components/breadcrumbs-component';
import ModelsDropdown from '@/components/nav/models-dropdown';
import BrowserPane from '@/components/panes/browser-pane/browser-pane';
import JumpToPane from '@/components/panes/jump-to-pane';
import ModelReleases from '@/components/panes/model-releases-pane';
import SearchExplanationsPane from '@/components/panes/search-explanations-pane';
import SearchInferenceModelPane from '@/components/panes/search-inference-model-pane';
import { BreadcrumbLink, BreadcrumbPage } from '@/components/shadcn/breadcrumbs';
import { getVisibilityBadge } from '@/components/visibility-badge';
import { SearchExplanationsType } from '@/lib/utils/general';
import { getFirstSourceForModel, getFirstSourceSetForModel } from '@/lib/utils/source';
import { ModelWithPartialRelations } from '@/prisma/generated/zod';
import { Visibility } from '@prisma/client';

export default function PageModel({ model }: { model: ModelWithPartialRelations }) {
  const firstSourceSet = getFirstSourceSetForModel(model, Visibility.PUBLIC, false, false);
  const firstSource = getFirstSourceForModel(model, Visibility.PUBLIC, false, false);
  return (
    <div className="flex w-full flex-col items-center pb-10">
      <BreadcrumbsComponent
        crumbsArray={[
          <BreadcrumbPage key={0}>
            <ModelsDropdown isInBreadcrumb />
          </BreadcrumbPage>,
          <BreadcrumbLink href={`/${model.id}`} key={1}>
            {model.displayName}
          </BreadcrumbLink>,
        ]}
      />

      <div className="flex w-full flex-row items-center justify-center border-b border-slate-200 py-6">
        <div className="flex w-full max-w-screen-lg flex-row items-center justify-between">
          <div className="flex flex-col items-start">
            {model.visibility !== Visibility.PUBLIC && (
              <div className="pb-1">{getVisibilityBadge(model.visibility)}</div>
            )}
            <div className="text-3xl font-bold text-slate-900">{model.id}</div>
            <div className="mt-2 text-sm font-normal text-slate-500">{model.owner}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full max-w-screen-lg">
        <div className="flex w-full flex-col items-center justify-center">
          <ModelReleases model={model} onlyFeatured={false} includeUnlisted={false} />
        </div>
      </div>

      <div className="mt-6 w-full max-w-screen-lg">
        <JumpToPane
          defaultModelId={model.id}
          defaultSourceSetName={firstSourceSet?.name || ''}
          vertical
          filterToFeaturedReleases={false}
        />
      </div>
      <div className="mt-6 w-full max-w-screen-lg">
        <SearchExplanationsPane
          initialModelId={model.id}
          initialSourceSetName={model.sourceSets && model.sourceSets.length > 0 ? model.sourceSets[0].name : ''}
          defaultTab={SearchExplanationsType.BY_MODEL}
          showTabs
        />
      </div>
      {firstSourceSet?.allowInferenceSearch && (
        <div className="mt-6 w-full max-w-screen-lg">
          <SearchInferenceModelPane model={model} />
        </div>
      )}

      <div className="mt-6 flex w-full max-w-screen-lg flex-col items-center text-slate-700 xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <BrowserPane
          modelId={model.id}
          sourceSet={firstSourceSet?.name || ''}
          layer={firstSource?.id || ''}
          showModel
        />
      </div>
    </div>
  );
}
