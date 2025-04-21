const fs = require('fs');
const http = require('http'); // or https if applicable

const configUrl = 'http://your-backend-host.com/api/proxy-config';

http
  .get(configUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      try {
        const backendConfig = JSON.parse(data);
        const proxyConfPath = 'apps/main/proxy.conf.json';
        const existingConfig = fs.existsSync(proxyConfPath)
          ? JSON.parse(fs.readFileSync(proxyConfPath, 'utf8'))
          : {};
        const newProxyConfig = { ...existingConfig, ...backendConfig };
        fs.writeFileSync(
          proxyConfPath,
          JSON.stringify(newProxyConfig, null, 2)
        );
        console.log('Proxy config updated successfully.');
      } catch (err) {
        console.error('Error parsing backend config:', err);
        process.exit(1);
      }
    });
  })
  .on('error', (err) => {
    console.error('Error fetching proxy config:', err);
    process.exit(1);
  });
