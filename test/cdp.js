const path = require('node:path');
const assert = require('node:assert');
const fs = require('node:fs');

const express = require('express');
const CDP = require('chrome-remote-interface');
const { Runtime } = require('node:inspector');
const app = express();
const expected = 'Infrastructure';
const template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

app.get('/', (req, res) => {
  res.type('html');
  res.send(template);
});

// Запускаем сервер который отдает на localhost:3000 html - ./index.html
app.listen(3000, () => {
  console.log('Server listen on port 3000');
  test();
});

async function test() {
  let client;

  try {
    client = await CDP();
    console.log('Connected to chrome');

    const { Network, Page } = client;

    // Включаем Network и Page
    await Network.enable();
    await Page.enable();

    // Нужно перейти на localhost:3000, дождаться инициализации DOM и вызвать нужные команды
    await Page.navigate({ url: 'http://localhost:3000' });
    await Page.loadEventFired();
    await client.DOM.enable();
    const rootJs = `(function() {
      return document?.getElementById('root').innerHTML
    }())`
    // https://www.youtube.com/watch?feature=shared&v=z0TP-9QSdHI
    const res = await client.Runtime.evaluate({
      expression: rootJs,
      awaitPromsie: true
    })
    console.log(res, 'res');

    const result = res.result.value;

    assert.equal(result, expected);

  } catch (err) {
    console.error(err);

  } finally {
    if (client) {
      await client.close();
    }

    process.exit(0);
  }
}
