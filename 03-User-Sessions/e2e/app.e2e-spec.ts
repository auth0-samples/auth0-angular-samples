import { UserSessionsPage } from './app.po';

describe('user-sessions App', function() {
  let page: UserSessionsPage;

  beforeEach(() => {
    page = new UserSessionsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
