import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;align-items:center;padding:20px 0;">
      <div [class]="'spinner-gradient ' + size" [class.animate-spin]="true"></div>
      @if (label) {
        <span style="margin-left:12px;font-size:13px;color:var(--text-secondary);">{{ label }}</span>
      }
    </div>
  `
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label = '';
  @Input() containerClass = '';
}
