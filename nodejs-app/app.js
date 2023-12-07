const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

// Express uygulaması oluştur
const app = express();

// Sunucu 3000 portundan dinlesin
const port = 3030;

app.get('/', (req, res) => {
  //public klasörünün içerisindeki index.html dosyasını gönder
  res.sendFile(__dirname + '/public/index.html');
});



// Apple'ın iPhone fiyatlarının bulunduğu URL
const appleURL = 'https://www.apple.com/tr/shop/buy-iphone/iphone-13';

// Verileri çekmek için HTTP GET isteği gönder
axios.get(appleURL)
  .then(response => {
    if (response.status === 200) {
      // Sayfa içeriğini Cheerio kullanarak ayrıştır
      const $ = cheerio.load(response.data);

      // Fiyat bilgilerini seçici kullanarak çek
      const iphonePrices = [];
      $('.as-price-currentprice').each((index, element) => {
        const price = $(element).text().trim();
        iphonePrices.push(price);
      });

      // PostgreSQL veritabanına kaydetmek için kullanılacak bilgiler
      const pgConfig = {
        user: 'bert6',
        host: 'localhost',
        database: 'pricegraphic',
        password: '123',
        port: '5432:5432'
      };

      // PostgreSQL'e bağlan
      const { Client } = require('pg');
      const pgClient = new Client(pgConfig);
      pgClient.connect();

      // iPhone fiyatlarını PostgreSQL'e kaydet
      iphonePrices.forEach((price, index) => {
        const query = `INSERT INTO iphone_prices (id, price) VALUES ($1, $2)`;
        const values = [index + 1, price];

        pgClient.query(query, values, (err, res) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Row inserted: ${res.rowCount}`);
          }
        });
      });

      // PostgreSQL bağlantısını kapat
      pgClient.end();
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});