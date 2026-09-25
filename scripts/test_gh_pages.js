async function testPages() {
  const url = 'https://adsrhyu.github.io/Birthday-Gift-For-My-Love/';
  const r = await fetch(url);
  console.log('HTTP Status:', r.status);
  const text = await r.text();
  console.log('Contains birthday-audio tag in HTML:', text.includes('id="birthday-audio"'));
  const m = text.match(/src="[^"]*assets\/(index-[^"]+\.js)"/);
  console.log('Bundle in HTML:', m ? m[1] : 'none');

  const flower = await fetch(url + 'blue_lily.png', { method: 'HEAD' });
  console.log('blue_lily.png status:', flower.status, 'len:', flower.headers.get('content-length'));
}

testPages().catch(console.error);
