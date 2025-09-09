import { Page, FullConfig, chromium } from '@playwright/test';
import type { User } from '../types';
// cleanupUser entfernt, um Race-Conditions zu vermeiden
import dotenv from 'dotenv';
dotenv.config();

const timeout = 20000;

async function register(page: Page, user: User, baseURL: string) {
  // Try API-first registration to avoid UI constraints (captcha/locale)
  const res = await page.request.post(`${baseURL}/api/auth/register`, {
    data: {
      name: 'test',
      username: 'test',
      email: user.email,
      password: user.password,
      confirm_password: user.password,
      token: undefined,
    },
    timeout,
  });
  if (res.ok()) {
    return;
  }
  // Fallback to UI registration if API fails (e.g., validation changes)
  await page.goto(`${baseURL}/register`, { timeout });
  await page.getByRole('form', { name: /Registration form/i }).waitFor({ state: 'visible', timeout });
  await page.getByTestId('name').fill('test');
  await page.getByTestId('username').fill('test');
  await page.getByTestId('email').fill(user.email);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('confirm_password').fill(user.password);
  await page.getByRole('button', { name: /Submit registration/i }).click();
}

async function logout(page: Page) {
  await page.getByTestId('nav-user').click();
  await page.getByRole('button', { name: 'Log out' }).click();
}

async function login(page: Page, user: User, baseURL: string) {
  // API login to set auth cookies directly
  const res = await page.request.post(`${baseURL}/api/auth/login`, {
    data: { username: user.email, password: user.password },
    timeout,
  });
  if (!res.ok()) {
    // Fallback to UI form if API rejects (e.g., rate limit)
    await page.goto(`${baseURL}/login`, { timeout });
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.locator('input[name="password"]').press('Enter');
  }
}

async function authenticate(config: FullConfig, user: User) {
  console.log('🤖: global setup has been started');
  const { baseURL, storageState } = config.projects[0].use;
  console.log('🤖: using baseURL', baseURL);
  console.dir(user, { depth: null });
  const browser = await chromium.launch({
    headless: false,
  });
  try {
    const page = await browser.newPage();
    console.log('🤖: 🗝  authenticating user:', user.email);

    if (!baseURL) {
      throw new Error('🤖: baseURL is not defined');
    }

    // Set localStorage before navigating to the page
    await page.context().addInitScript(() => {
      localStorage.setItem('navVisible', 'true');
    });
    console.log('🤖: ✔️  localStorage: set Nav as Visible', storageState);

    await page.goto(baseURL, { timeout });
    await register(page, user, baseURL);
    // Try API login regardless, to ensure auth cookies are present
    await login(page, user, baseURL);

    // Logout
    // await logout(page);
    // await page.waitForURL(`${baseURL}/login`, { timeout });
    // console.log('🤖: ✔️  user successfully logged out');

    // If we are already on /c/new after registration, skip login
    // Ensure we land on the chat page
    await page.goto(`${baseURL}/c/new`, { timeout });
    await page.waitForURL(`${baseURL}/c/new`, { timeout });
    console.log('🤖: ✔️  user successfully authenticated');

    await page.context().storageState({ path: storageState as string });
    console.log('🤖: ✔️  authentication state successfully saved in', storageState);
    // await browser.close();
    // console.log('🤖: global setup has been finished');
  } finally {
    await browser.close();
    console.log('🤖: global setup has been finished');
  }
}

export default authenticate;
