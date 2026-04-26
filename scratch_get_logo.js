const https = require('https');

https.get('https://codemarefi.blogspot.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const matches = data.match(/<img[^>]+src=\"([^\"]+(?:png|jpg|jpeg|gif))\"/g);
    if (matches) {
      matches.forEach(m => console.log(m));
    } else console.log("Hic resim bulunamadi.");
  });
}).on("error", (err) => console.log("Error: " + err.message));
