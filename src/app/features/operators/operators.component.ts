import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperatorService } from '../../core/services/operator.service';
import { OperatorResponse } from '../../core/models/operator.models';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-operators',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Telecom Operators</h1>
        <p class="page-subtitle">Browse all available operators</p>
      </div>

      @if (loading()) {
        <app-spinner label="Loading operators..."/>
      } @else if (operators().length === 0) {
        <div style="text-align:center;padding:48px 0;">
          <div style="font-size:48px;margin-bottom:16px;">📡</div>
          <p style="color:var(--text-secondary);">No operators available.</p>
        </div>
      } @else {
        <!-- Operator Cards Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
          @for (op of operators(); track op.id) {
            <div class="glass-card" style="display:flex;flex-direction:column;gap:12px;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2));border:1px solid rgba(99,102,241,0.3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
                    📡
                  </div>
                  <div>
                    <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);">{{ op.name }}</h3>
                    <span style="font-size:12px;color:var(--text-muted);font-family:monospace;">{{ op.code }}</span>
                  </div>
                </div>
                <span [ngClass]="op.active ? 'badge-success' : 'badge-gray'">
                  {{ op.active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              @if (op.description) {
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;">{{ op.description }}</p>
              }

              <div style="margin-top:auto;padding-top:8px;border-top:1px solid var(--glass-border);">
                <a [routerLink]="['/plans']" [queryParams]="{ operatorId: op.id }"
                  style="font-size:13px;color:#a78bfa;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:4px;">
                  View Plans →
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class OperatorsComponent implements OnInit {
  private operatorService = inject(OperatorService);
  loading   = signal(true);
  operators = signal<OperatorResponse[]>([]);

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe({
      next: (data) => { this.operators.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
