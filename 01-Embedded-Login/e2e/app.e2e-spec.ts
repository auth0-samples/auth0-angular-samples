import { EmbeddedLogin } from './app.po';

describe('login App', function() {
  let page: EmbeddedLogin;

  beforeEach(() => {
    page = new EmbeddedLogin();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
