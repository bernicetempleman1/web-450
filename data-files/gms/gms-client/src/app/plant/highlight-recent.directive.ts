import { Directive, ElementRef, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[appHighlightRecent]',
  standalone: true,
})
export class HighlightRecentDirective implements OnInit {
  @Input() appHighlightRecent: string = '';
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    const plantedDate = new Date(this.appHighlightRecent);
    const currentDate = new Date();
    const diffDays = Math.ceil(
      (currentDate.getTime() - plantedDate.getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays <= 30) {
      this.el.nativeElement.style.backgroundColor = '#90EE90';
    }
  }
}
