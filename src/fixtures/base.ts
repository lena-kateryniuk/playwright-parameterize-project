export * from '@playwright/test'
import { test as base, expect } from '@playwright/test'

type Mode = 'light' | 'dark';

export type TestOption = {
    mode: Mode;
}

type TestFixtures = {
    setMode: void;
}

export const test = base.extend<TestOption & TestFixtures>({
    mode: ['light', { option: true }], 

    //автофікстура setMode
    setMode: [async ({ page, isMobile, mode}, use) => {
        const changeModeButton = page.getByRole('button', { name: 'Switch between dark and light mode' })   
        const getMode = async (): Promise<Mode> => await page.locator('html').getAttribute('data-theme') as Mode;

        await page.goto('/');

        if (isMobile && await getMode() !== mode) {
            await page.getByLabel('Toggle navigation bar').click();
            await changeModeButton.click();
            await page.getByLabel('Close navigation bar').click();
        } else if (await getMode() !== mode) await changeModeButton.click();
        
        expect (await getMode()).toBe(mode);
        
        await use();
    }, { auto: true }]
})