async function checkJs() {
  const r = await fetch('https://special-gift-for-my-love.vercel.app/assets/index-BfoJolKa.js');
  const t = await r.text();
  console.log('Length:', t.length);
  const heartMatches = t.match(/heart_lace[^"']*/g);
  console.log('Matches:', heartMatches);
}

checkJs().catch(console.error);
