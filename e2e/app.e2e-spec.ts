import { OutgrowFrontendPage } from './app.po';

describe('outgrow-frontend App', function() {
  let page: OutgrowFrontendPage;

  beforeEach(() => {
    page = new OutgrowFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
