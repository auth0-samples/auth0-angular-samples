import { CustomLoginPage } from './app.po';

describe('custom-login App', function() {
  let page: CustomLoginPage;

  beforeEach(() => {
    page = new CustomLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
