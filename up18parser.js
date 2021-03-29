const needle = require('needle');
const tress = require('tress');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const path = require('path');
const URLresolve = require('url').resolve;

const urlArgument = process.argv.find(item => item.startsWith("--url") || item.startsWith("--u="));
const folderArgument = process.argv.find(item => item.startsWith("--folder") || item.startsWith("--f="));
const resultFileArgument = process.argv.find(item => item.startsWith("--fileName") || item.startsWith("--fn="));
const notDownloadImagesArgument = process.argv.find(item => item.startsWith("--withoutImages") || item.startsWith("--wi"));
const firsFileName = (resultFileArgument && resultFileArgument.split('=')[1]) || 'data.json';

const baseFolder = (folderArgument && folderArgument.split('=')[1]) || 'files';
const baseUrl = (urlArgument && urlArgument.split('=')[1]) || 'https://up18.by/brends/toya/';
const baseFileName = firsFileName.endsWith('.json') ? firsFileName : firsFileName + '.json';
const withoutImagesFlag = !!notDownloadImagesArgument || false;

if (!fs.existsSync(baseFolder) && !withoutImagesFlag){
  fs.mkdirSync(baseFolder);
}

console.log('Будут собраны элемент со страницы - ' + baseUrl);
console.log('Информация будет записана в файл - ' + baseFileName);
if (!withoutImagesFlag) {
  console.log('Фотографии будут сохранены в папку - ' + baseFolder);
}

const results = {
  mappedParsedData: [],
}

class Item {
  artikul;
  image;
  itemTitle;
  linkTo;
  price;

  constructor(artikul, image, itemTitle, linkTo, price) {
    this.artikul = artikul;
    this.image = image;
    this.itemTitle = itemTitle;
    this.linkTo = linkTo;
    this.price = price;
  }
}

var q = tress(function (url, callback) {

  if (!url) {
    return;
  }

  needle('get', encodeURI(url))
    .then(async function (res) {
      if (res.statusCode === 301) {
        q.push(res.headers.location);
        return;
      }

      var $ = cheerio.load(res.body);
      console.log('Сбор информации со страницы - ' + url);
      const nextPage = $('.pagination span + a').attr('href');
      if (nextPage) {
        q.push(nextPage);
      }


      const parsedItems = await parseItems($);
      results.mappedParsedData.push(...parsedItems);

    })
    .then(() => {
      callback();
    })
    .catch(err => console.log(err))


});

q.drain = function () {
  console.log('Данные собраны!')
  fs.writeFileSync(baseFileName, JSON.stringify(results, null, 4));
}

q.push(baseUrl);

async function parseItems($) {

  return new Promise(async (resolve, reject) => {

    const itemToParse = []
    const amount = $('.item').length;
    $('.item').each(async (i, element) => {

      const $element = $(element);

      const promiseToGetItem = new Promise(async (res, rej) => {

        const price = $element.find('[itemProp="price"]').text().trim();
        const articul = $element.find('.itemArt span').text().trim();
        const itemTitle = $element.find('.itemTitle span').text().trim();
        const linkTo = getValidLink($element.find('.itemTitle a').attr('href'));
        const imageLink = $element.find('img').attr('src');
        const fileName = withoutImagesFlag ? getValidLink(imageLink) : await download(imageLink);

        const item = new Item(articul, fileName, itemTitle, linkTo, price);

        res(item);
      });

      itemToParse.push(promiseToGetItem);

      if (i === amount - 1) {
        resolve(await Promise.all(itemToParse));
      }
    });

  });

}

async function download(uri) {
  uri = getValidLink(uri);
  const filename = uri.split('/').reverse()[0];
  if (fs.existsSync(path.join(baseFolder, filename))) {
    return filename;
  }
  return new Promise((res, rej) => {
    request(encodeURI(uri))
      .pipe(fs.createWriteStream(path.join(baseFolder, filename)))
      .on('close', () => {
        res(filename)
      })
      .on('error', rej);
  });
};

function getValidLink(link) {
  return URLresolve('https://up18.by/', link);
}

