async function testPages() {
  const url = 'https://adsrhyu.github.io/Birthday-Gift-For-My-Love/';
  const r = await fetch(url);
  console.log('HTTP Status:', r.status);
  const text = await r.text();
  console.log('Title:', text.match(/<title>([^<]+)<\/title>/)?.[1]);
  console.log('Script tags:', text.match(/<script[^>]+src="[^"]+"[^>]*>/g));

  const heartRes = await fetch(url + 'heart_lace_hd.png', { method: 'HEAD' });
  console.log('heart_lace_hd status:', heartRes.status, 'len:', heartRes.headers.get('content-length'));

  const ogRes = await fetch(url + 'og-image.png', { method: 'HEAD' });
  console.log('og-image status:', ogRes.status, 'len:', ogRes.headers.get('content-length'));
}

testPages().catch(console.error);
