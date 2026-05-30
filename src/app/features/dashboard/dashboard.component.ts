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

      <!-- Welcome Banner -->
      <div class="glass-card" style="margin-bottom:24px;background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15));border-color:rgba(99,102,241,0.3);">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <h1 style="font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">
              Welcome back 👋
            </h1>
            <p style="color:var(--text-secondary);font-size:14px;">{{ auth.currentUser()?.email }}</p>
          </div>
          <a routerLink="/recharge" class="btn-primary">
            ⚡ New Recharge
          </a>
        </div>
      </div>

      <!-- Stat Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-bottom:28px;">
        <div class="stat-card">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(99,102,241,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📱</div>
          <div>
            <div style="font-size:26px;font-weight:800;color:var(--text-primary);">{{ recharges().length }}</div>
            <div style="font-size:12px;color:var(--text-secondary);font-weight:500;">Total Recharges</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(16,185,129,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">✅</div>
          <div>
            <div style="font-size:26px;font-weight:800;color:#10b981;">{{ successCount() }}</div>
            <div style="font-size:12px;color:var(--text-secondary);font-weight:500;">Successful</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">💰</div>
          <div>
            <div style="font-size:26px;font-weight:800;color:#a78bfa;">₹{{ totalSpent() | number:'1.0-0' }}</div>
            <div style="font-size:12px;color:var(--text-secondary);font-weight:500;">Total Spent</div>
          </div>
        </div>
        <div class="stat-card">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(59,130,246,0.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">💳</div>
          <div>
            <div style="font-size:26px;font-weight:800;color:#3b82f6;">{{ transactions().length }}</div>
            <div style="font-size:12px;color:var(--text-secondary);font-weight:500;">Transactions</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px;">
        <a routerLink="/recharge" class="btn-primary">⚡ New Recharge</a>
        <a routerLink="/recharge/history" class="btn-secondary">📋 Recharge History</a>
        <a routerLink="/plans" class="btn-secondary">📦 Browse Plans</a>
        <a routerLink="/transactions" class="btn-secondary">💳 Transactions</a>
      </div>

      <!-- Recent Recharges -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <h2 style="font-size:16px;font-weight:700;color:var(--text-primary);">Recent Recharges</h2>
          <a routerLink="/recharge/history" style="font-size:13px;color:#a78bfa;text-decoration:none;font-weight:500;">View all →</a>
        </div>

        @if (loading()) {
          <app-spinner label="Loading recent recharges..."/>
        } @else if (recentRecharges().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">📱</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">No recharges yet.</p>
            <a routerLink="/recharge" class="btn-primary">Make your first recharge</a>
          </div>
        } @else {
          <div style="overflow-x:auto;">
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
                    <td class="table-cell" style="color:var(--text-secondary);">{{ r.planName }}</td>
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
