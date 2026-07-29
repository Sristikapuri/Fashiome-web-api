import path from "node:path";
import { test, expect } from "../fixtures";


test.describe("AI Outfit Generation", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });

  test("should echo the user's styling prompt in the stylist chat", async ({ page }) => {
    await page.goto("/dashboard?tab=ai-stylist");

    const prompt = "A casual summer outfit for a beach day";
    const promptInput = page.getByPlaceholder(/beach wedding next week/i);
    await promptInput.fill(prompt);
    await page.locator("form button:has(svg.lucide-send)").click();

    await expect(page.getByText(prompt, { exact: true })).toBeVisible();
    await expect(promptInput).toHaveValue("");
  });

  test("should add a new stylist message after using the custom outfit generator", async ({ page }) => {
    
    test.setTimeout(120_000);
    await page.goto("/dashboard?tab=ai-stylist");

    
    const generateButton = page.getByRole("button", { name: /Generat/i });
    const chatMessages = page.locator(".overflow-y-auto.p-4.space-y-4 > div");
    const initialCount = await chatMessages.count();

    await generateButton.click();


    await expect(chatMessages).toHaveCount(initialCount + 1, { timeout: 60_000 });
    await expect(generateButton).toHaveText(/Generate Outfit/, { timeout: 60_000 });
  });
});
