import { AuthorizationPage } from './app.po';

describe('authorization App', () => {
  let page: AuthorizationPage;

  beforeEach(() => {
    page = new AuthorizationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
