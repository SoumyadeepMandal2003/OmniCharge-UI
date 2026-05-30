import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-box" style="max-width:420px;" (click)="$event.stopPropagation()">
          <div style="padding:28px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
              <div style="width:44px;height:44px;border-radius:12px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
                ⚠️
              </div>
              <h3 style="font-size:17px;font-weight:700;color:var(--text-primary);">{{ title }}</h3>
            </div>
            <p style="color:var(--text-secondary);font-size:14px;margin-bottom:24px;line-height:1.6;">{{ message }}</p>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
              <button class="btn-secondary" (click)="onCancel()">Cancel</button>
              <button class="btn-danger" (click)="onConfirm()">{{ confirmLabel }}</button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmLabel = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); }
  onCancel()  { this.cancelled.emit(); }
}
