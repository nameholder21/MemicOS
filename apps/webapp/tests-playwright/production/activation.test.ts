import { test, expect } from '@playwright/test'

// test('gemma-2-2b', async ({ page }) => {
//     await page.goto('https://memicos.org/search');

//     //changes model but 2-2b is current default
//     await page.locator('[data-state="closed"][data-sentry-source-file="model-selector.tsx"]').click();
//     await page.getByText('DEEPSEEK-R1-LLAMA-8B').click();
//     await page.getByText('Random').click();
    
//     //first occurence is the model selector, second is first result
//     await page.getByText('LLAMASCOPE').nth(1).click();
    
//     //count of 'testing' in case its already on page
//     const targetWord = 'testing';
//     const regWord = await page.getByText(new RegExp(`\\b${targetWord}\\b`, 'i'));

//     //count occurrences
//     const countTest = await regWord.count();

//     //search activation
//     const actSearch = page.getByPlaceholder('Test activation with custom text.');
//     await actSearch.fill('testing');
//     await page.getByRole('button', { name: 'test'}).click();

//     //check for change
//     const finalTest = page.geteByText(new RegExp(`\\b${targetWord}\\b`, 'i'));
//     const finalCount = await finalTest.count();

//     expect(finalCount).toBe(initialCount + 3);
// });

//unable to interact with activation text box 3/25
test.fixme('deepseek', async ({ page }) => {
    await page.goto('https://memicos.org/search');

    await page.locator('[data-state="closed"][data-sentry-source-file="model-selector.tsx"]').click();
    await page.getByText('DEEPSEEK-R1-LLAMA-8B').click();
    await page.getByText('Random').click();
    
    //first occurence is the model selector, second is first result
    await page.getByText('LLAMASCOPE').nth(1).click();
    
    //count of 'testing' in case its already on page
    const targetWord = 'testing';
    const regWord = await page.getByText(new RegExp(`\\b${targetWord}\\b`, 'i'));

    //count occurrences
    const countTest = await regWord.count();

    //search activation
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: 'Test activation with custom' }).click();
    await page.getByRole('textbox', { name: 'Test activation with custom' }).fill('testing');
    await page.getByRole('button', { name: 'Test' }).click();

    //check for change
    const finalTest = page.getByText(new RegExp(`\\b${targetWord}\\b`, 'i'));
    const finalCount = await finalTest.count();

    expect(finalCount).toBe(countTest + 3);
});