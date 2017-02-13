import { Login.UpdatePage } from './app.po';

describe('login.update App', function() {
  let page: Login.UpdatePage;

  beforeEach(() => {
    page = new Login.UpdatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
