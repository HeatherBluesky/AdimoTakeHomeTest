const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
  .then(response => {
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Get product elements
    const productElements = document.querySelectorAll('.item');

    // Initialize data object
    const data = {
      products: [],
      totalItems: productElements.length,
      totalPrice: 0,
      averagePrice: 0,
    };
 
    // Process each product element
    productElements.forEach(productElement => {
      const title = productElement.querySelector('h1').textContent;
      const imageUrl = productElement.querySelector('img').getAttribute('src');
      const price = parseFloat(productElement.querySelector('.price').textContent.replace('£', ''));
      data.totalPrice += price;
      data.averagePrice = data.totalPrice / data.totalItems;      

      // Add product to data object
      data.products.push({
        title,
        imageUrl,
        price,
      });
    });

    // Write data to JSON file
    fs.writeFile('products.json', JSON.stringify(data, null, 2), err => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Data written to products.json file');
      }
    });
  })
  .catch(error => {
    console.error('Error retrieving data:', error);
  });
