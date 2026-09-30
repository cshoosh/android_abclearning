import { showParentAreaTransitionAd } from './ads';

describe('ads service', () => {
  it('never shows an ad without a reviewed provider', async () => {
    await expect(showParentAreaTransitionAd()).resolves.toBe(false);
  });
});
