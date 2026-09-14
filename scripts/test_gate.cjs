async function testGate() {
  const nv_mid = '82754642762';
  const url = 'https://cr.shopping.naver.com/v2/bridge/searchGate?nv_mid=' + nv_mid;
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
  const text = await res.text();
  console.log('Body len:', text.length);
  const match = text.match(/location\.replace\(['"]([^'"]+)['"]\)/);
  if (match) {
    console.log('Script redirect:', match[1]);
  }
}
testGate();
