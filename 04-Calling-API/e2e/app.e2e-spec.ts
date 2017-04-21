import { CallingApiPage } from './app.po';

describe('calling-api App', () => {
  let page: CallingApiPage;

  beforeEach(() => {
    page = new CallingApiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
