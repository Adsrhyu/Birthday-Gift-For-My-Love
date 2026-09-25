async function testPages() {
  const url = 'https://adsrhyu.github.io/Birthday-Gift-For-My-Love/';
  const r = await fetch(url);
  console.log('HTTP Status:', r.status);
  const text = await r.text();
  console.log('Contains birthday-audio tag in HTML:', text.includes('id="birthday-audio"'));
  console.log('Contains instant autoplay script:', text.includes('Instant Auto-Play Audio'));
  const m = text.match(/src="[^"]*assets\/(index-[^"]+\.js)"/);
  console.log('Bundle in HTML:', m ? m[1] : 'none');
}

testPages().catch(console.error);
