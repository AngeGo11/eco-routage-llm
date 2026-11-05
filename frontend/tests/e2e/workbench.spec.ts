import { expect, test } from "@playwright/test";

const sample = {
  energy_source:"compareai", energy_model:"input-output", input_tokens:12, models_evaluated:3,
  recommended_model:"Modèle B", quality_filter_applied:true,
  results: [
    {name:"Modèle A",estimated_wh:.02,output_tokens_est:200,observations:100,factor_source:"CompareAI observé",reaction_quality:.55,reaction_count:150,recommended:false,base_energy_wh:.002,input_energy_wh:.003,output_energy_wh:.015},
    {name:"Modèle B",estimated_wh:.04,output_tokens_est:210,observations:100,factor_source:"CompareAI observé",reaction_quality:.82,reaction_count:190,recommended:true,base_energy_wh:.002,input_energy_wh:.004,output_energy_wh:.034},
  ],
};

test.beforeEach(async ({page}) => {
  await page.route("**/api/health", route => route.fulfill({
    status:200, contentType:"application/json",
    body:JSON.stringify({status:"ready",compareai_available:true,reactions_available:true,mlenergy_available:true}),
  }));
  await page.route("**/api/estimate", route => route.fulfill({
    status:200, contentType:"application/json", body:JSON.stringify(sample),
  }));
  await page.goto("/");
  await expect(page.getByRole("button",{name:/lancer l'estimation/i})).toBeEnabled();
});

test("disposition adaptée à l'écran sans débordement", async ({page}) => {
  const mobile=test.info().project.name.includes("mobile");
  const left=await page.locator(".results-column").boundingBox();
  const right=await page.locator(".composer-column").boundingBox();
  expect(left && right).toBeTruthy();
  if(mobile) expect(right!.y+right!.height).toBeLessThanOrEqual(left!.y+2);
  else expect(left!.x+left!.width).toBeLessThanOrEqual(right!.x+2);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.screenshot({path:`test-results/layout-${test.info().project.name}.png`,fullPage:true});
});

test("résultats, ventilation et export CSV accessibles", async ({page}) => {
  await page.getByRole("textbox",{name:/prompt à analyser/i}).fill("Résume la sobriété numérique");
  await page.getByLabel("MODÈLE DE CALCUL").selectOption("input-output");
  await page.getByRole("button",{name:/lancer l'estimation/i}).click();
  await expect(page.getByText(/\+0,02 Wh estimés par rapport au minimum/)).toBeVisible();
  await page.getByRole("button",{name:"Afficher les détails du modèle Modèle A"}).click();
  await expect(page.getByText("VENTILATION DU CALCUL ADDITIF")).toBeVisible();
  const download=page.waitForEvent("download");
  await page.getByRole("button",{name:"Exporter CSV"}).click();
  expect((await download).suggestedFilename()).toMatch(/^eco-routage-resultats-/);
  await page.screenshot({path:`test-results/resultats-${test.info().project.name}.png`,fullPage:true});
});

test("les données manquantes bloquent le calcul", async ({page}) => {
  await page.route("**/api/health", route => route.fulfill({
    status:200,contentType:"application/json",
    body:JSON.stringify({status:"missing_data",compareai_available:false,reactions_available:false,mlenergy_available:false}),
  }));
  await page.reload();
  await expect(page.getByText("Jeu de données CompareAI manquant sur le serveur.")).toBeVisible();
  await expect(page.getByRole("button",{name:/lancer l'estimation/i})).toBeDisabled();
});
