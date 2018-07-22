const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});


describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  afterEach(async () => {
    await page.close();
  });

  test('Can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('When using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'Test Title');
      await page.type('.content input', 'Test Content');
      await page.click('form button');
    });
    afterEach(async () => {
      await page.close();
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submitting adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('Test Title');
      expect(content).toEqual('Test Content');
    });
  });

  describe('When using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    afterEach(async () => {
      await page.close();
    });

    test('The form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});


describe('When logged in', async () => {
  afterEach(async () => {
    await page.close();
  });

  test('User cannot create blog post', async () => {
    const result = await page.evaluate(() => {
      return fetch('/api/blogs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Title',
          content: 'Test content',
        }),
      })
      .then(res => res.json());
    });
    
    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('User cannot get a list of posts', async () => {
    const result = await page.evaluate(() => {
      return fetch('/api/blogs', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Content-type': 'application/json' },
      })
      .then(res => res.json());
    });

    expect(result).toEqual({ error: 'You must log in!' });
  });
});