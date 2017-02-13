import { CustomPage } from './app.po';

describe('custom App', function() {
  let page: CustomPage;

  beforeEach(() => {
    page = new CustomPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
