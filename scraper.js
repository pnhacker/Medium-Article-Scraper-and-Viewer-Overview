const puppeteer = require('puppeteer');

async function scrapeMediumArticles(topic) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://medium.com/search?q=${topic}`);

  await page.waitForSelector('article');

  const articles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article')).slice(0, 5).map(article => {
      const titleElement = article.querySelector('h2');
      const authorElement = article.querySelector('.ds-link');
      const dateElement = article.querySelector('time');
      const linkElement = article.querySelector('a');

      return {
        title: titleElement ? titleElement.innerText : null,
        author: authorElement ? authorElement.innerText : null,
        publicationDate: dateElement ? dateElement.getAttribute('datetime') : null,
        url: linkElement ? linkElement.href : null
      };
    });
  });

  await browser.close();
  return articles;
}

module.exports = { scrapeMediumArticles };
