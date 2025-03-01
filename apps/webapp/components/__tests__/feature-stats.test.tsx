import { ANIMAL_FEATURE } from '@/vitest/test-features';
import { render, screen } from '@/vitest/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FeatureStats from '../feature-stats';
import { Providers } from '../provider/providers';

vi.stubGlobal('URL', { createObjectURL: vi.fn() });
vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}));

describe('FeatureStats', () => {
  const setup = () => {
    render(
      <Providers
        initialModels={{}}
        initialExplanationTypes={[]}
        initialExplanationModels={[]}
        initialReleases={[]}
        initialExplanationScoreTypes={[]}
        initialExplanationScoreModelTypes={[]}
      >
        <FeatureStats currentNeuron={ANIMAL_FEATURE} />
      </Providers>,
    );
  };

  test('Shows Activation Density label', () => {
    setup();
    expect(screen.getByText(/Negative Logits/)).toBeDefined();
  });
});
