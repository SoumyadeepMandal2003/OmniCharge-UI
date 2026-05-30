import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OperatorService } from '../../core/services/operator.service';
import { PlanResponse, OperatorResponse } from '../../core/models/operator.models';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SpinnerComponent],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <h1 class="page-title">Recharge Plans</h1>
        <p class="page-subtitle">Browse all available plans</p>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <select [(ngModel)]="operatorFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:170px;">
          <option value="">All Operators</option>
          @for (op of operators(); track op.id) {
            <option [value]="op.id">{{ op.name }}</option>
          }
        </select>
        <select [(ngModel)]="typeFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:150px;">
          <option value="">All Types</option>
          <option value="PREPAID">Prepaid</option>
          <option value="POSTPAID">Postpaid</option>
          <option value="DATA">Data</option>
          <option value="TALKTIME">Talktime</option>
          <option value="COMBO">Combo</option>
        </select>
        <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()"
          class="input-field" style="width:220px;" placeholder="🔍 Search plans..."/>
        <span style="font-size:13px;color:var(--text-muted);">{{ filtered().length }} plans</span>
      </div>

      @if (loading()) {
        <app-spinner label="Loading plans..."/>
      } @else if (filtered().length === 0) {
        <div style="text-align:center;padding:48px 0;">
          <div style="font-size:48px;margin-bottom:16px;">📦</div>
          <p style="color:var(--text-secondary);">No plans found.</p>
        </div>
      } @else {
        <!-- Plan Cards Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
          @for (plan of filtered(); track plan.id) {
            <div class="glass-card" style="display:flex;flex-direction:column;gap:12px;transition:transform 0.2s,box-shadow 0.2s;">
              <!-- Header -->
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
                <div>
                  <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">{{ plan.name }}</h3>
                  <span style="font-size:12px;color:var(--text-secondary);">{{ plan.operatorName }}</span>
                </div>
                <span [ngClass]="typeBadge(plan.type)">{{ plan.type }}</span>
              </div>

              <!-- Price + Validity -->
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:24px;font-weight:800;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">₹{{ plan.price }}</span>
                <span style="font-size:13px;color:var(--text-secondary);">⏱ {{ plan.validityDays }} days</span>
              </div>

              <!-- Details -->
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                @if (plan.data) {
                  <div style="display:flex;align-items:center;gap:5px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:8px;padding:4px 10px;font-size:12px;color:var(--text-secondary);">
                    📶 {{ plan.data }}
                  </div>
                }
                @if (plan.calls) {
                  <div style="display:flex;align-items:center;gap:5px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:4px 10px;font-size:12px;color:var(--text-secondary);">
                    📞 {{ plan.calls }}
                  </div>
                }
                @if (plan.sms) {
                  <div style="display:flex;align-items:center;gap:5px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:4px 10px;font-size:12px;color:var(--text-secondary);">
                    💬 {{ plan.sms }}
                  </div>
                }
              </div>

              @if (plan.description) {
                <p style="font-size:12px;color:var(--text-muted);line-height:1.5;">{{ plan.description }}</p>
              }

              <!-- Action -->
              <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--glass-border);">
                <a routerLink="/recharge" class="btn-primary btn-sm" style="width:100%;justify-content:center;">
                  ⚡ Recharge Now
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PlansComponent implements OnInit {
  private operatorService = inject(OperatorService);
  private route = inject(ActivatedRoute);

  loading  = signal(true);
  plans    = signal<PlanResponse[]>([]);
  filtered = signal<PlanResponse[]>([]);
  operators = signal<OperatorResponse[]>([]);

  operatorFilter: string | number = '';
  typeFilter = '';
  searchTerm = '';

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe({ next: (ops) => this.operators.set(ops) });
    this.operatorService.getAllPlans().subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
        this.route.queryParams.subscribe(params => {
          if (params['operatorId']) this.operatorFilter = +params['operatorId'];
          this.applyFilter();
        });
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    let result = this.plans();
    if (this.operatorFilter) result = result.filter(p => p.operatorId === +this.operatorFilter);
    if (this.typeFilter) result = result.filter(p => p.type === this.typeFilter);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.operatorName.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
      );
    }
    this.filtered.set(result);
  }

  typeBadge(type: string): string {
    const map: Record<string, string> = {
      'PREPAID': 'badge-success', 'POSTPAID': 'badge-info',
      'DATA': 'badge-warning', 'TALKTIME': 'badge-gray', 'COMBO': 'badge-purple'
    };
    return map[type] ?? 'badge-gray';
  }
}
