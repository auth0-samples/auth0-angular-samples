import { EmbeddedLoginPage } from './app.po';

describe('embedded-login App', () => {
  let page: EmbeddedLoginPage;

  beforeEach(() => {
    page = new EmbeddedLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
