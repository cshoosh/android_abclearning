import { purchasePremium, restorePremium } from './purchases';

describe('development purchase provider', () => {
  test('mock purchase and restore exercise premium flow', async () => {
    await expect(purchasePremium(true)).resolves.toMatchObject({ active: true });
    await expect(restorePremium(true)).resolves.toMatchObject({ active: true });
  });
  test('production mode stays locked until a real provider is configured', async () => {
    await expect(purchasePremium(false)).resolves.toMatchObject({ active: false });
    await expect(restorePremium(false)).resolves.toMatchObject({ active: false });
  });
});
