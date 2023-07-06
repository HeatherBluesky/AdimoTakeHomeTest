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
      totalItems: 0,
      totalPrice: 0,
      averagePrice: 0,
      quantity: 0
    };

    // Process each product element
    productElements.forEach(productElement => {
      const title = productElement.querySelector('h1').textContent;
      const imageUrl = productElement.querySelector('img').getAttribute('src');
      const price = parseFloat(productElement.querySelector('.price').textContent.replace('£', ''));
    //   const quantity = parseInt(productElement.querySelector('.quantity').textContent);  
    //   no quantity on website?

      
      // Add product to data object
      data.products.push({
        title,
        imageUrl,
        price
      });
    });

    // logic to work out average price 
    if (data.totalItems > 0) {
        data.averagePrice = data.totalPrice / data.totalItems;
      }
  

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
