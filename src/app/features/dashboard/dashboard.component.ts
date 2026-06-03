import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RechargeService } from '../../core/services/recharge.service';
import { PaymentService } from '../../core/services/payment.service';
import { RechargeResponse } from '../../core/models/recharge.models';
import { TransactionResponse } from '../../core/models/payment.models';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { LocalDatePipe } from '../../shared/utils/local-date.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent, LocalDatePipe],
  template: `
    <div class="animate-fade-in">

      <!-- Stat Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
        <!-- Total Recharges -->
        <div class="stat-card">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <div style="font-size:28px;font-weight:800;color:var(--text-primary);">{{ recharges().length }}</div>
            <div style="font-size:13px;color:var(--text-secondary);font-weight:500;">Total Recharges</div>
          </div>
        </div>
        <!-- Successful -->
        <div class="stat-card">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#10b981,#34d399);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <div style="font-size:28px;font-weight:800;color:var(--text-primary);">{{ successCount() }}</div>
            <div style="font-size:13px;color:var(--text-secondary);font-weight:500;">Successful</div>
          </div>
        </div>
        <!-- Total Spent -->
        <div class="stat-card">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div>
            <div style="font-size:28px;font-weight:800;color:var(--text-primary);">₹{{ totalSpent() | number:'1.0-0' }}</div>
            <div style="font-size:13px;color:var(--text-secondary);font-weight:500;">Total Spent</div>
          </div>
        </div>
        <!-- Transactions -->
        <div class="stat-card">
          <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#f59e0b,#fbbf24);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <div>
            <div style="font-size:28px;font-weight:800;color:var(--text-primary);">{{ transactions().length }}</div>
            <div style="font-size:13px;color:var(--text-secondary);font-weight:500;">Transactions</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-bottom:24px;">
        <!-- New Recharge -->
        <a routerLink="/recharge" style="text-decoration:none;">
          <div class="glass-card" style="display:flex;align-items:center;gap:16px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;padding:20px 24px;"
            onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 32px rgba(99,102,241,0.2)'"
            onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">New Recharge</div>
              <div style="font-size:12px;color:var(--text-secondary);">Recharge any mobile</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </a>
        <!-- Recharge History -->
        <a routerLink="/recharge/history" style="text-decoration:none;">
          <div class="glass-card" style="display:flex;align-items:center;gap:16px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;padding:20px 24px;"
            onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 32px rgba(16,185,129,0.2)'"
            onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#10b981,#34d399);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Recharge History</div>
              <div style="font-size:12px;color:var(--text-secondary);">View past recharges</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </a>
        <!-- Browse Plans -->
        <a routerLink="/plans" style="text-decoration:none;">
          <div class="glass-card" style="display:flex;align-items:center;gap:16px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;padding:20px 24px;"
            onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 32px rgba(139,92,246,0.2)'"
            onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div style="width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#8b5cf6,#a78bfa);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="7" height="7"/><rect x="15" y="3" width="7" height="7"/>
                <rect x="15" y="15" width="7" height="7"/><rect x="2" y="15" width="7" height="7"/>
              </svg>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Browse Plans</div>
              <div style="font-size:12px;color:var(--text-secondary);">Explore available plans</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </a>
      </div>

      <!-- Recent Recharges -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div>
            <h2 style="font-size:16px;font-weight:700;color:var(--text-primary);">Recent Recharges</h2>
            <p style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Your last 5 recharges</p>
          </div>
          <a routerLink="/recharge/history" style="font-size:13px;color:#a78bfa;text-decoration:none;font-weight:600;display:flex;align-items:center;gap:4px;">
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>

        @if (loading()) {
          <app-spinner label="Loading recent recharges..."/>
        } @else if (recentRecharges().length === 0) {
          <div style="text-align:center;padding:48px 0;">
            <div style="width:56px;height:56px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <p style="color:var(--text-secondary);margin-bottom:16px;font-size:14px;">No recharges yet</p>
            <a routerLink="/recharge" class="btn-primary">Make your first recharge</a>
          </div>
        } @else {
          <div style="overflow-x:auto;margin-top:16px;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">Mobile</th>
                  <th class="table-header">Operator</th>
                  <th class="table-header">Plan</th>
                  <th class="table-header">Amount</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                @for (r of recentRecharges(); track r.id) {
                  <tr class="table-row">
                    <td class="table-cell" style="font-weight:600;">{{ r.mobileNumber }}</td>
                    <td class="table-cell">{{ r.operatorName }}</td>
                    <td class="table-cell">
                      <a routerLink="/plans" style="color:#a78bfa;text-decoration:none;font-weight:500;">{{ r.planName }}</a>
                    </td>
                    <td class="table-cell"><strong style="color:var(--text-primary);">₹{{ r.amount }}</strong></td>
                    <td class="table-cell"><span [ngClass]="statusBadge(r.status)">{{ r.status }}</span></td>
                    <td class="table-cell" style="color:var(--text-secondary);white-space:nowrap;">{{ r.createdAt | localDate:'dd MMM, HH:mm' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private rechargeService = inject(RechargeService);
  private paymentService  = inject(PaymentService);

  loading         = signal(true);
  recharges       = signal<RechargeResponse[]>([]);
  transactions    = signal<TransactionResponse[]>([]);
  recentRecharges = signal<RechargeResponse[]>([]);
  successCount    = signal(0);
  totalSpent      = signal(0);

  ngOnInit(): void {
    this.rechargeService.getHistory().subscribe({
      next: (data) => {
        this.recharges.set(data);
        this.recentRecharges.set(data.slice(0, 5));
        this.successCount.set(data.filter(r => r.status === 'COMPLETED' || r.status === 'SUCCESS').length);
        this.totalSpent.set(data.filter(r => r.status === 'COMPLETED' || r.status === 'SUCCESS').reduce((s, r) => s + Number(r.amount), 0));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    const userId = this.auth.currentUser()?.userId;
    if (userId) {
      this.paymentService.getTransactionsByUser(userId).subscribe({
        next: (data) => this.transactions.set(data),
        error: () => {}
      });
    }
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      'COMPLETED': 'badge-success', 'SUCCESS': 'badge-success',
      'PENDING': 'badge-warning', 'PROCESSING': 'badge-info', 'FAILED': 'badge-danger'
    };
    return map[status] ?? 'badge-gray';
  }
}
