const https = require('https');

const cars = ['Toyota Avanza', 'Honda Brio', 'Suzuki Ertiga', 'Toyota Innova', 'Honda CR-V', 'Mitsubishi Pajero Sport', 'Toyota Alphard', 'Lexus LM', 'Mercedes-Benz S-Class', 'BMW 7 Series'];

async function fetchImages() {
  for (const car of cars) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(car)}&prop=pageimages&format=json&pithumbsize=800`;
    
    await new Promise(resolve => {
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            console.log(`${car}: ${pages[pageId].thumbnail.source}`);
          } else {
            console.log(`${car}: NOT FOUND`);
          }
          resolve();
        });
      });
    });
  }
}

fetchImages();
