import { HighlightRecentDirective } from './highlight-recent.directive';
import { ElementRef } from '@angular/core';
describe('HighlightRecentDirective', () => {
  let elementRef: ElementRef;
  let directive: HighlightRecentDirective;
  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));
    directive = new HighlightRecentDirective(elementRef);
  });
  it('should highlight the element if the date is within the last 30 days', () => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10); // 10 days ago
    directive.appHighlightRecent = recentDate.toISOString();
    directive.ngOnInit();
    expect(elementRef.nativeElement.style.backgroundColor).toBe(
      'rgb(144, 238, 144)'
    ); //RGB value for #90EE90
  });
  it('should not highlight the element if the date is more than 30 days ago', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 40); // 40 days ago
    directive.appHighlightRecent = oldDate.toISOString();
    directive.ngOnInit();
    expect(elementRef.nativeElement.style.backgroundColor).toBe('');
  });
});
