import { HostedLoginPage } from './app.po';

describe('hosted-login App', () => {
  let page: HostedLoginPage;

  beforeEach(() => {
    page = new HostedLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
