import { CentralizedLoginPage } from './app.po';

describe('centralized-login App', () => {
  let page: CentralizedLoginPage;

  beforeEach(() => {
    page = new CentralizedLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
