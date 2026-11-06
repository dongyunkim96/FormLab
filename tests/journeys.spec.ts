import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("expanded catalog exposes new themes, specifications, and purchasable variants", async ({
  page,
}) => {
  await page.goto("/shop?category=Switches&feel=Tactile");
  await expect(page.getByText("6 objects", { exact: true })).toBeVisible();
  await page
    .getByRole("link", { name: "View Stone Heavy Tactile", exact: true })
    .click();
  await expect(page.getByText("70 g", { exact: true })).toBeVisible();
  await page.goto("/shop?q=Sea+Glass");
  await expect(page.getByText("1 object", { exact: true })).toBeVisible();
  await page
    .getByRole("link", { name: "View Sea Glass PBT", exact: true })
    .click();
  await page.getByRole("button", { name: "Sea Glass", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Sea Glass PBT" }),
  ).toBeVisible();
  await expect(page.getByText("Sea Glass", { exact: true })).toBeVisible();
});
test("query filters survive product navigation and browser back", async ({
  page,
}) => {
  await page.goto("/shop?category=Keyboards&q=75");
  await expect(page.getByText("8 objects", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View FORM 75", exact: true }).click();
  await page.getByRole("link", { name: "Back to collection" }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search products" }),
  ).toHaveValue("75");
  await expect(page).toHaveURL(/category=Keyboards&q=75/);
});
test("variant and quantity persist through refresh", async ({ page }) => {
  await page.goto("/products/form-75");
  await expect(page.getByRole("button", { name: "Add to bag" })).toBeDisabled();
  await page.getByRole("button", { name: "Cobalt", exact: true }).click();
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/cart");
  await page.reload();
  await expect(page.getByText("Cobalt", { exact: true })).toBeVisible();
  await expect(page.locator(".quantity output")).toHaveText("2");
});
test("save and reload every shared component, resolve compatibility, and edit one of two builds", async ({
  page,
}) => {
  await page.goto("/build");
  await page.getByRole("button", { name: "02 Case" }).click();
  await page.getByRole("button", { name: /Cobalt aluminum/ }).click();
  await page.getByRole("button", { name: "03 Switches" }).click();
  await page.getByRole("button", { name: /Moss tactile/ }).click();
  await page.getByRole("button", { name: "04 Keycaps" }).click();
  await page.getByRole("button", { name: /After Hours PBT/ }).click();
  await page.getByRole("button", { name: "05 Accessories" }).click();
  await page.getByRole("button", { name: /Grid desk mat/ }).click();
  await page.getByRole("button", { name: "Save build", exact: true }).click();
  await page.getByLabel("Build name").fill("My cobalt desk");
  await page.getByRole("button", { name: "Save named build" }).click();
  await page.getByRole("button", { name: "Share build", exact: true }).click();
  const url = await page.getByLabel("Share URL").inputValue();
  await page.goto(url);
  await page.getByRole("button", { name: "06 Review" }).click();
  await expect(
    page.getByText("Moss tactile · 3 × 35-switch packs"),
  ).toBeVisible();
  await expect(
    page.getByText("After Hours PBT", { exact: true }).last(),
  ).toBeVisible();
  await expect(page.locator(".builder-summary strong")).toHaveText("$274");
  await page.getByRole("button", { name: "Add your build to bag" }).click();
  await page.goto("/build");
  await page.getByRole("button", { name: "01 Layout" }).click();
  await page.getByRole("button", { name: /65% — Keep it compact/ }).click();
  await expect(page.getByRole("dialog")).toContainText("does not support 65%");
  await page.getByRole("button", { name: "Apply compatible build" }).click();
  await page.getByRole("button", { name: "06 Review" }).click();
  await page.getByRole("button", { name: "Add your build to bag" }).click();
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await page.getByRole("link", { name: "Edit build" }).first().click();
  await page.getByRole("button", { name: "05 Accessories" }).click();
  await page.getByRole("button", { name: /Oak wrist rest/ }).click();
  await page.getByRole("button", { name: "06 Review" }).click();
  await page.getByRole("button", { name: "Update build in bag" }).click();
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(page.locator(".cart-line").last()).toContainText("FORM 65%");
});
test("demo checkout validates and its confirmation is durable", async ({
  page,
}) => {
  await page.goto("/products/form-65");
  await page.getByRole("button", { name: "Chalk", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  for (const [label, value] of [
    ["Email address", "demo@example.com"],
    ["Full name", "Demo Person"],
    ["Street address", "123 Example Street"],
    ["City", "Brooklyn"],
    ["State", "NY"],
    ["ZIP code", "11201"],
  ]) {
    const input = page.getByLabel(label, { exact: true });
    await input.focus();
    await page.keyboard.type(value);
    await page.keyboard.press("Tab");
  }
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page).toHaveURL(/orders\/DEMO-/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Good things took form." }),
  ).toBeVisible();
  await expect(
    page.getByText("No payment was collected.", { exact: false }),
  ).toBeVisible();
});

test("editing a named saved build replaces that build and supports undo", async ({
  page,
}) => {
  await page.goto("/build");
  await page.getByRole("button", { name: "Save build", exact: true }).click();
  await page.getByLabel("Build name").fill("First idea");
  await page.getByRole("button", { name: "Save named build" }).click();
  await page.goto("/saved");
  await page.getByRole("link", { name: "Open build" }).click();
  await page.getByRole("button", { name: "Save build", exact: true }).click();
  await expect(page.getByLabel("Build name")).toHaveValue("First idea");
  await page.getByLabel("Build name").fill("Refined idea");
  await page.getByRole("button", { name: "Save named build" }).click();
  await page.goto("/saved");
  await expect(page.locator(".saved-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Refined idea" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete Refined idea" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Refined idea" }),
  ).toBeVisible();
});

test("mobile filter drafts apply explicitly and empty results reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/shop");
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Layout", { exact: true }).selectOption("TKL");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page).not.toHaveURL(/layout/);
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Layout", { exact: true }).selectOption("TKL");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/layout=TKL/);
  await expect(page.getByText("8 objects", { exact: true })).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill("unfindable-object");
  await expect(
    page.getByRole("heading", { name: "A little too specific?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset all" }).click();
  await expect(page.getByText("116 objects", { exact: true })).toBeVisible();
});

test("optional 3D loads and bounded view buttons keep controls usable", async ({
  page,
}) => {
  await page.goto("/build");
  await page.getByRole("button", { name: "Explore in 3D" }).click();
  await expect(page.locator(".webgl-stage canvas")).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole("button", { name: "Rotate right" }).click();
  await page.getByRole("button", { name: "Zoom in" }).click();
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await page.getByRole("button", { name: "Explode view" }).click();
  await page.screenshot({ path: "test-results/preview-3d.png" });
  await page.getByRole("button", { name: "Use 2D preview" }).click();
  await page.getByRole("button", { name: "06 Review" }).click();
  await expect(
    page.getByRole("button", { name: "Add your build to bag" }),
  ).toBeEnabled();
});

test("normal routes have no uncaught browser errors or failed local assets", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith("http://localhost:5173") && r.status() >= 400)
      errors.push(`${r.status()} ${r.url()}`);
  });
  for (const route of [
    "/",
    "/shop",
    "/products/form-75",
    "/build",
    "/saved",
    "/cart",
    "/about",
  ]) {
    await page.goto(route);
    await page.getByRole("heading", { level: 1 }).first().waitFor();
  }
  expect(errors).toEqual([]);
});
test("mobile reduced motion and WebGL failure preserve builder purchasing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/build");
  await page.getByRole("button", { name: "Enable optional 3D" }).click();
  await page.getByRole("button", { name: "06 Review" }).click();
  await page.getByRole("button", { name: "Add your build to bag" }).click();
  await expect(
    page.getByRole("link", { name: "Continue to demo checkout" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("dialogs support keyboard dismissal, checkout focus and accessibility scans", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search the collection" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Search the collection" }),
  ).toBeFocused();
  for (const route of ["/", "/shop", "/build"]) {
    await page.goto(route);
    await page.getByRole("heading", { level: 1 }).waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
test("responsive pages stay within the viewport", async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/shop", "/build"]) {
      await page.goto(route);
      await page.getByRole("heading", { level: 1 }).waitFor();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
      await page.screenshot({
        path: `test-results/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
    }
  }
});
