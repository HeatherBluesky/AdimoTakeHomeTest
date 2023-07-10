const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

axios.get('https://www.jjfoodservice.com/search?b&page=0&q=nestle&size=12',)
  .then(response => {
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Get product elements
    const productElements = document.querySelectorAll('.Productstyle__Container-sc-1ssfvqo-0 ZNdqy')

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
      const title = titleElement ? titleElement.textContent : '';
    
      const imageElement = productElement.querySelector('img.Imagestyle__Img-sc-1o9v7pr-0');
      const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
    
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
    fs.writeFile('nestleProducts.json', JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Data written to nestleProducts.json file');
      }
    });
  })
  .catch(error => {
    console.error('Error retrieving data:', error);
  });
