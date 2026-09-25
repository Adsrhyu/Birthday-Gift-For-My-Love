async function verifyLive() {
  const url = 'https://special-gift-for-my-love.vercel.app';
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
  console.log('Age:', res.headers.get('age'));
  console.log('X-Vercel-Cache:', res.headers.get('x-vercel-cache'));
  const html = await res.text();
  const match = html.match(/src="\/assets\/(index-[^"]+\.js)"/);
  console.log('Main bundle match:', match ? match[1] : 'not found');
  if (match) {
    const jsRes = await fetch(url + '/assets/' + match[1]);
    const js = await jsRes.text();
    console.log('Includes mountain_v1 in bundle:', js.includes('mountain_v1'));
  }
}

verifyLive().catch(console.error);
