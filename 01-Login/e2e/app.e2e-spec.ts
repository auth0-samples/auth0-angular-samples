import { Login } from './app.po';

describe('login App', function() {
  let page: Login;

  beforeEach(() => {
    page = new Login();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
