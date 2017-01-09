import { LoginPage } from './app.po';

describe('login App', function() {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
