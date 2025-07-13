// C:\Nightwing\backend\server.js
const express = require('express');
const app = express();

app.get('/health', (_req, res) => res.send('OK'));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Plain JS server listening on http://localhost:${PORT}`);
});
