async function checkAll() {
  const domains = [
    'special-gift-for-my-love.vercel.app',
    'special-birthday-gift-for-my-love.vercel.app',
    'gift-for-my-love.vercel.app',
    'birhtday-gift-for-my-love-ryan.vercel.app',
    'special-birthday-gift-for-my-love-ryan.vercel.app',
    'birhtday-gift-for-ryan-my-love.vercel.app',
    'birthday-gift-for-my-love-adsrhyu1.vercel.app'
  ];

  for (const d of domains) {
    try {
      const r = await fetch('https://' + d);
      const text = await r.text();
      const match = text.match(/src="\/assets\/(index-[^"]+\.js)"/);
      console.log(d, '-> HTTP', r.status, 'bundle:', match ? match[1] : 'none');
    } catch (e) {
      console.log(d, '-> Error:', e.message);
    }
  }
}

checkAll().catch(console.error);
