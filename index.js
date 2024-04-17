import puppeteer from 'puppeteer';
import { whilst, forEachOfSeries } from 'async';

let itemsIds = [];

async function openWebPage() {
  forEachOfSeries(
    [
      'https://listado.mercadolibre.com.co/bebes/articulos-maternidad/almohadas-lactancia/almohada-embarazada_NoIndex_True',
      'https://listado.mercadolibre.com.co/bebes/articulos-maternidad/almohadas-lactancia/almohada-embarazada_NoIndex_True',
    ],
    (link, index, callbackOne) => {
      (async () => {
        try {
          await processLink(link);
          callbackOne();
        } catch (error) {
          console.error(error);
          callbackOne();
        }
      })();
    },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Fin de toda la extracción de links');
    }
  );
}

async function processLink(link) {
  const browser = await puppeteer.launch({ slowMo: 200 });
  const page = await browser.newPage();
  await page.goto(link);
  let buttonNext = await page.$('li[class="andes-pagination__button andes-pagination__button--next andes-pagination__button--disabled"]');
  while (!buttonNext) {
    await page.click('a[title="Siguiente"]');
    const result = await page.evaluate(() => {
      const itemsIds = document.querySelectorAll('input[name="itemId"]');
      return [...itemsIds].map((item) => {
        return item.value;
      });
    });
    itemsIds = [...itemsIds, ...result];
    console.log(`Se han extraído ${itemsIds.length} items`);
    buttonNext = await page.$('li[class="andes-pagination__button andes-pagination__button--next andes-pagination__button--disabled"]');
  }
  browser.close();
}

openWebPage();
