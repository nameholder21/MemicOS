import { expect, test } from '@playwright/test';

test('Introduction page', async ({ page }) => {
  await page.goto('https://docs.memicos.org');
  await expect(page).toHaveTitle(/Introduction | MemicOS Docs/);
});

test('launch tweets', async ({ page }) => {
  await page.goto('https://docs.memicos.org');

  const link = page.locator('a:has-text("johnny")').first();
  await expect(link).toHaveAttribute('href', 'https://x.com/johnnylin/status/1773403396130885844');
});

test('third embed tweet', async ({ page }) => {
  await page.goto('https://docs.memicos.org');

  const link = page.locator('a:has-text("johnnylin")').nth(2);
  await expect(link).toHaveAttribute('href', 'https://x.com/johnnylin/status/1773403397489881423');
});

test('lesswrong link', async ({ page }) => {
  await page.goto('https://docs.memicos.org');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('LessWrong').click()]);

  await expect(newPage).toHaveURL(/.*lesswrong.com/);
});

test('Sparse Autoencoder page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');
  await expect(page).toHaveTitle(/Sparse Autoencoder | MemicOS Docs/);
});

test('sae explanation link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('Here is an explainer on SAEs').click(),
  ]);

  await expect(newPage).toHaveURL('https://transformer-circuits.pub/2023/monosemantic-features');
});

test('example gpt2 link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://memicos.org/gpt2-small/9-res-jb').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/gpt2-small/9-res-jb');
});

test('example res-jb link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('RES-JB').nth(2).click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/gpt2-small/res-jb');
});

test('example p70d link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('P70D-SM').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/p70d-sm');
});

test('example att-sm link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('ATT-SM').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/pythia-70m-deduped/att-sm');
});

test('example mlp-sm link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('MLP-SM').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/pythia-70m-deduped/mlp-sm');
});

test('example res-sm link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/sparse-autoencoder');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('RES-SM').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/pythia-70m-deduped/res-sm');
});

test('SAE Features page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/features');
  await expect(page).toHaveTitle(/SAE Features | MemicOS Docs/);
});

test('resr_scefr-ajt link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/features');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://memicos.org/gpt2-small/6-res_scefr-ajt/650').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/gpt2-small/6-res_scefr-ajt/650');
});

test('example feature link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/features');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://www.memicos.org/gpt2-small/6-res_scefr-ajt/650').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/gpt2-small/6-res_scefr-ajt/650');
});

test('example json api link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/features');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://www.memicos.org/api/feature/gpt2-small/6-res_scefr-ajt/650').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/api/feature/gpt2-small/6-res_scefr-ajt/650');
});

test('api sandbox link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/features');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('API sandbox').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/api-doc');
});

test('Steering Using SAE Features page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/steering');
  await expect(page).toHaveTitle(/Steering Using SAE Features | MemicOS Docs/);
});

test('steer link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/steering');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://www.memicos.org/steer').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/steer');
});

test('api docs link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/steering');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('API Docs').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/api-doc');
});

test('Embed Features (iframe) page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/embed-iframe');
  await expect(page).toHaveTitle(/Embed Features (iframe) | MemicOS Docs/);
});

test('Search page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/search');
  await expect(page).toHaveTitle(/Search | MemicOS Docs/);
});

test('example search link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/search');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('example search').nth(1).click()]);

  await expect(newPage).toHaveURL(/https:\/\/www\.memicos\.org\/gpt2-small.*/);
});

test('lesswrong case study link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/search');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText("Exploring OpenAI's Latent Directions: Tests, Observations, and Poking Around").click(),
  ]);

  await expect(newPage).toHaveURL(
    'https://www.lesswrong.com/posts/QwgYmpnMxBZnmGCsw/exploring-openai-s-latent-directions-tests-observations-and',
  );
});

test('Lists & Embed Lists page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/lists');
  await expect(page).toHaveTitle(/Lists & Embed Lists | MemicOS Docs/);
});

test('movie sentiment features link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/lists');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('movie sentiment').click()]);

  await expect(newPage).toHaveURL('https://www.memicos.org/list/clt3c1c200001298tvcoquyt7');
});

test('quick list link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/lists');

  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.getByText('is here').click()]);

  await expect(newPage).toHaveURL(
    'https://www.memicos.org/quick-list?name=hello%2C%20this%20is%20a%20quick%20list!%20all%20the%20necessary%20data%20is%20in%20the%20URL&features=%5B%7B%22modelId%22%3A%20%22gpt2-small%22%2C%20%22layer%22%3A%20%226-res-jb%22%2C%20%22index%22%3A%20%222320%22%7D%2C%20%7B%22modelId%22%3A%20%22gpt2-small%22%2C%20%22layer%22%3A%20%223-res-jb%22%2C%20%22index%22%3A%20%221029%22%7D%5D',
  );
});

test('API and Exports page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/api');
  await expect(page).toHaveTitle(/API and Exports | MemicOS Docs/);
});

test('test api direct link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/api');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://memicos.org/api-doc').click(),
  ]);

  await expect(newPage).toHaveURL('https://www.memicos.org/api-doc');
});

test('data exports link', async ({ page }) => {
  await page.goto('https://docs.memicos.org/api');

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByText('https://memicos-exports.s3.amazonaws.com/index.html').click(),
  ]);

  await expect(newPage).toHaveURL('https://memicos-exports.s3.amazonaws.com/index.html');
});

test('Upload Your SAEs page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/upload-saes');
  await expect(page).toHaveTitle(/Upload Your SAEs | MemicOS Docs/);
});

test('Feedback & Support page', async ({ page }) => {
  await page.goto('https://docs.memicos.org/feedback');
  await expect(page).toHaveTitle(/Feedback & Support | MemicOS Docs/);
});
