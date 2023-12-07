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
 