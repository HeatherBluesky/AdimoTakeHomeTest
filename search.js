const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const params = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  },
};

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the search term: ', (searchTerm) => {
  rl.close();

  axios.get(`https://www.jjfoodservice.com/search?b&page=0&q=${encodeURIComponent(searchTerm)}&size=12`, params)
    .then(response => {
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Get product elements
      const productElements = document.querySelectorAll('.SearchPagestyle__ResultsWrapper-sc-1c66j3i-8.glecnj')

      console.log("product elements", productElements)


      // Initialize data object
      const data = {
        products: [],
        totalItems: productElements.length,
        totalPrice: 0,
        averagePrice: 0
      };

      // Process each product element
      productElements.forEach(productElement => {
        const titleElement = productElement.querySelector("a.Productstyle__Name-sc-1ssfvqo-9.gyYGTV");
        const title = titleElement ? titleElement.textContent : 'unable to find item';
      
        const imageElement = productElement.querySelector('img.Imagestyle__Img-sc-1o9v7pr-0');
        const imageUrl = imageElement ? imageElement.getAttribute('src') : 'unable to find image';
      
        const priceElement = productElement.querySelector('div.Productstyle__PriceText-sc-1ssfvqo-33');
        const price = priceElement ? parseFloat(priceElement.textContent.replace('£', '')) : 0;
      
        // Add product to data object
        data.products.push({
          title,
          imageUrl,
          price
        });
      });

      // Write data to JSON file
      fs.writeFile('searchResults.json', JSON.stringify(data, null, 2), err => {
        if (err) {
          console.error('Error writing JSON file:', err);
        } else {
          console.log('Data written to searchResults.json file');
        }
      });
    })
    .catch(error => {
      console.error('Error retrieving data:', error);
    });
});
