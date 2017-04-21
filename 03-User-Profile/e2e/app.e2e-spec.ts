import { UserProfilePage } from './app.po';

describe('user-profile App', () => {
  let page: UserProfilePage;

  beforeEach(() => {
    page = new UserProfilePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
