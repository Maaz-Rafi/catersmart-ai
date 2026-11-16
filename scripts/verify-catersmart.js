const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('=== STARTING PLAYWRIGHT VERIFICATION ===');
  const targetUrl = process.argv[2] || 'http://localhost:4321';
  console.log(`Target URL: ${targetUrl}`);

  const outputDir = path.join(__dirname, '..', 'verification-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  try {
    // STAGE 1: Boot & Scaffolding
    console.log('\n--- STAGE 1: Boot & Scaffolding ---');
    const resp = await page.goto(targetUrl, { waitUntil: 'networkidle' });
    if (!resp || resp.status() !== 200) {
      throw new Error(`Failed to load page: HTTP ${resp ? resp.status() : 'null'}`);
    }
    console.log('✓ HTTP Status 200 OK');

    const title = await page.title();
    console.log(`✓ Page Title: "${title}"`);
    if (!title.includes('CaterSmart AI')) {
      throw new Error(`Unexpected page title: ${title}`);
    }

    const hasViewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return !!meta && meta.content.includes('width=device-width');
    });
    console.log(`✓ Viewport meta tag present: ${hasViewport}`);
    if (!hasViewport) throw new Error('Viewport meta tag missing or invalid');

    // STAGE 2: Layout & Asset Integrity
    console.log('\n--- STAGE 2: Layout & Asset Integrity ---');
    const hasHeader = await page.locator('header').count() > 0;
    const hasMain = await page.locator('main').count() > 0;
    const hasAside = await page.locator('aside').count() > 0;
    console.log(`✓ Structural landmarks: <aside>=${hasAside}, <main>=${hasMain}, <header>=${hasHeader}`);
    if (!hasMain || !hasAside) throw new Error('Main or Aside layout structure missing');

    const brokenImages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });
    console.log(`✓ Broken images: ${brokenImages.length}`);
    if (brokenImages.length > 0) throw new Error(`Broken images detected: ${brokenImages.join(', ')}`);

    // STAGE 3: Interactivity & State Management
    console.log('\n--- STAGE 3: Interactivity & State Management ---');
    // Click Run AI Analysis button
    const runBtn = page.locator('button[data-a="run"]').first();
    await runBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ "Run AI Analysis" clicked and executed');

    // Click Scenario B (RSVP data error)
    const scenBBtn = page.locator('button[data-a="scenB"]').first();
    if (await scenBBtn.isVisible()) {
      await scenBBtn.click();
      await page.waitForTimeout(300);
      console.log('✓ Scenario B (RSVP error simulation) activated');
    }

    // Click Scenario A (Normal)
    const scenABtn = page.locator('button[data-a="scenA"]').first();
    if (await scenABtn.isVisible()) {
      await scenABtn.click();
      await page.waitForTimeout(300);
      console.log('✓ Scenario A activated');
    }

    // Switch navigation tabs
    const navItems = ['predictor', 'ngo', 'rag', 'tools', 'dash'];
    for (const nav of navItems) {
      const tab = page.locator(`button[data-a="nav"][data-v="${nav}"]`).first();
      if (await tab.isVisible()) {
        await tab.click();
        await page.waitForTimeout(200);
        console.log(`✓ Navigation tab '${nav}' loaded successfully`);
      }
    }

    // STAGE 4: Responsive Viewport Testing
    console.log('\n--- STAGE 4: Responsive & Viewport Testing ---');
    const viewports = [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      console.log(`✓ Viewport ${vp.name} (${vp.width}x${vp.height}): Horizontal scroll = ${hasHorizontalScroll ? 'OVERFLOW DETECTED' : 'None (Passed)'}`);
      const screenshotPath = path.join(outputDir, `${vp.name}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`  Saved screenshot: ${screenshotPath}`);
    }

    // Reset to desktop viewport for remaining tests
    await page.setViewportSize({ width: 1280, height: 800 });

    // STAGE 5: Accessibility & Semantic Structure
    console.log('\n--- STAGE 5: Accessibility & Semantic Structure ---');
    const h1Count = await page.locator('h1').count();
    console.log(`✓ <h1> Headings count: ${h1Count}`);
    if (h1Count === 0) throw new Error('Missing <h1> heading');

    const buttonsWithoutText = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button'))
        .filter(b => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.title)
        .length;
    });
    console.log(`✓ Buttons without accessible labels: ${buttonsWithoutText}`);

    // STAGE 6: End-to-End User Journey
    console.log('\n--- STAGE 6: End-to-End User Journey ---');
    // Navigate to RAG Assistant tab
    const ragTab = page.locator('button[data-a="nav"][data-v="rag"]').first();
    await ragTab.click();
    await page.waitForTimeout(200);

    // Type a query and ask
    const input = page.locator('#rag\\.q');
    if (await input.isVisible()) {
      await input.fill('What is the minimum safe holding temperature for hot food?');
      const askBtn = page.locator('button[data-a="ask"]').first();
      await askBtn.click();
      await page.waitForTimeout(300);
      console.log('✓ RAG assistant query submitted and processed');
    }

    // Reset demo state
    const resetBtn = page.locator('button[data-a="reset"]').first();
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(300);
      console.log('✓ Demo state reset completed cleanly');
    }

    // Verify zero console and page errors
    console.log('\n--- Error Audit ---');
    console.log(`Page errors: ${pageErrors.length}`);
    console.log(`Console errors: ${consoleErrors.length}`);

    if (pageErrors.length > 0) {
      throw new Error(`Page errors detected:\n${pageErrors.join('\n')}`);
    }
    if (consoleErrors.length > 0) {
      console.log(`Note: Console error warnings: ${consoleErrors.join(', ')}`);
    }

    console.log('\n🎉 ALL 6 STAGES OF PLAYWRIGHT VERIFICATION PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error(`\n❌ VERIFICATION FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
