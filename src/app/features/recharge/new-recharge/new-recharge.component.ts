import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OperatorService } from '../../../core/services/operator.service';
import { RechargeService } from '../../../core/services/recharge.service';
import { ToastService } from '../../../core/services/toast.service';
import { OperatorResponse, PlanResponse } from '../../../core/models/operator.models';
import { RechargeResponse } from '../../../core/models/recharge.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-new-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
  template: `
    <div class="animate-fade-in" style="max-width:640px;">
      <div class="page-header">
        <h1 class="page-title">New Recharge</h1>
        <p class="page-subtitle">Recharge any mobile number instantly</p>
      </div>

      <!-- Success Screen -->
      @if (success()) {
        <div class="card animate-slide-up" style="text-align:center;padding:40px 32px;">
          <!-- Green checkmark circle -->
          <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#10b981,#34d399);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 32px rgba(16,185,129,0.4);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style="font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">Recharge Successful!</h2>
          <p style="color:var(--text-secondary);margin-bottom:28px;font-size:14px;">Your recharge has been processed successfully.</p>

          <!-- Receipt Card -->
          <div style="border:1px solid var(--glass-border);border-radius:12px;overflow:hidden;margin-bottom:28px;text-align:left;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid var(--glass-border);">
              <span style="color:var(--text-secondary);font-size:13px;">Recharge ID</span>
              <span style="font-family:monospace;font-size:12px;color:var(--text-primary);">{{ result()?.rechargeId }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid var(--glass-border);">
              <span style="color:var(--text-secondary);font-size:13px;">Mobile</span>
              <span style="font-weight:600;color:var(--text-primary);">{{ result()?.mobileNumber }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid var(--glass-border);">
              <span style="color:var(--text-secondary);font-size:13px;">Operator</span>
              <span style="color:var(--text-primary);">{{ result()?.operatorName }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid var(--glass-border);">
              <span style="color:var(--text-secondary);font-size:13px;">Plan</span>
              <span style="color:var(--text-primary);">{{ result()?.planName }}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:rgba(99,102,241,0.05);">
              <span style="color:var(--text-primary);font-size:14px;font-weight:700;">Total Paid</span>
              <span style="font-size:18px;font-weight:800;color:#a78bfa;">₹{{ result()?.amount }}</span>
            </div>
          </div>

          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button class="btn-secondary" (click)="resetForm()">New Recharge</button>
            <a routerLink="/recharge/history" class="btn-primary">View History</a>
          </div>
        </div>

      } @else {
        <div class="card">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- Mobile Number -->
            <div class="form-group">
              <label class="label">📱 Mobile Number</label>
              <input type="tel" formControlName="mobileNumber" class="input-field"
                [class.input-error]="f['mobileNumber'].invalid && f['mobileNumber'].touched"
                placeholder="9876543210" maxlength="10" autocomplete="tel"/>
              @if (f['mobileNumber'].invalid && f['mobileNumber'].touched) {
                <p style="color:var(--danger);font-size:12px;margin-top:5px;">Enter a valid 10-digit Indian mobile number</p>
              }
            </div>

            <!-- Operator Selection -->
            <div class="form-group">
              <label class="label">📡 Select Operator</label>
              @if (loadingOperators()) {
                <app-spinner size="sm" label="Loading operators..."/>
              } @else {
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                  @for (op of operators(); track op.id) {
                    <button type="button" (click)="selectOperator(op)"
                      class="operator-btn"
                      [class.operator-btn-active]="selectedOperator()?.id === op.id">
                      {{ op.name }}
                    </button>
                  }
                </div>
                @if (f['operatorId'].invalid && f['operatorId'].touched) {
                  <p style="color:var(--danger);font-size:12px;margin-top:5px;">Please select an operator</p>
                }
              }
            </div>

            <!-- Plan Selection -->
            @if (selectedOperator()) {
              <div class="form-group">
                <label class="label">📦 Select Plan</label>
                @if (loadingPlans()) {
                  <app-spinner size="sm" label="Loading plans..."/>
                } @else if (plans().length === 0) {
                  <p style="color:var(--text-secondary);font-size:13px;">No plans available for this operator.</p>
                } @else {
                  <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:0;">
                    @for (plan of plans(); track plan.id) {
                      <button type="button" (click)="selectPlan(plan)"
                        class="plan-select-btn"
                        [class.plan-select-btn-active]="selectedPlan()?.id === plan.id">
                        <div style="flex:1;text-align:left;">
                          <div style="font-weight:600;color:var(--text-primary);margin-bottom:2px;">{{ plan.name }}</div>
                          <div style="font-size:12px;color:var(--text-secondary);display:flex;gap:10px;flex-wrap:wrap;">
                            @if (plan.data) { <span>📶 {{ plan.data }}</span> }
                            @if (plan.calls) { <span>📞 {{ plan.calls }}</span> }
                            @if (plan.sms) { <span>💬 {{ plan.sms }}</span> }
                            <span>⏱ {{ plan.validityDays }}d validity</span>
                          </div>
                        </div>
                        <div style="margin-left:16px;text-align:right;flex-shrink:0;">
                          <span style="font-size:16px;font-weight:800;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">₹{{ plan.price }}</span>
                        </div>
                      </button>
                    }
                  </div>
                  @if (f['planId'].invalid && f['planId'].touched) {
                    <p style="color:var(--danger);font-size:12px;margin-top:5px;">Please select a plan</p>
                  }
                }
              </div>
            }

            <!-- Summary -->
            @if (selectedPlan() && form.value.mobileNumber) {
              <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:16px;margin-bottom:20px;">
                <p style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Summary</p>
                <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;">
                  <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:13px;color:var(--text-secondary);">
                    <span>📱 {{ form.value.mobileNumber }}</span>
                    <span>·</span>
                    <span>{{ selectedOperator()?.name }}</span>
                    <span>·</span>
                    <span>{{ selectedPlan()?.name }}</span>
                  </div>
                  <span style="font-size:20px;font-weight:800;background:linear-gradient(135deg,#6366f1,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">₹{{ selectedPlan()?.price }}</span>
                </div>
              </div>
            }

            @if (error()) {
              <div class="alert-error">{{ error() }}</div>
            }

            <button type="submit" class="btn-primary btn-lg" style="width:100%;" [disabled]="loading()">
              @if (loading()) {
                <span style="display:inline-flex;align-items:center;gap:8px;">
                  <span class="spinner-gradient sm animate-spin"></span> Processing...
                </span>
              } @else {
                ⚡ Proceed to Recharge
              }
            </button>
          </form>
        </div>
      }
    </div>
  `
})
export class NewRechargeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private operatorService = inject(OperatorService);
  private rechargeService = inject(RechargeService);
  private toast = inject(ToastService);

  loadingOperators = signal(true);
  loadingPlans     = signal(false);
  loading          = signal(false);
  error            = signal('');
  success          = signal(false);

  operators        = signal<OperatorResponse[]>([]);
  plans            = signal<PlanResponse[]>([]);
  selectedOperator = signal<OperatorResponse | null>(null);
  selectedPlan     = signal<PlanResponse | null>(null);
  result           = signal<RechargeResponse | null>(null);

  form = this.fb.group({
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    operatorId:   [null as number | null, Validators.required],
    planId:       [null as number | null, Validators.required]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe({
      next: (ops) => { this.operators.set(ops); this.loadingOperators.set(false); },
      error: () => this.loadingOperators.set(false)
    });
  }

  selectOperator(op: OperatorResponse): void {
    this.selectedOperator.set(op);
    this.selectedPlan.set(null);
    this.form.patchValue({ operatorId: op.id, planId: null });
    this.loadingPlans.set(true);
    this.operatorService.getPlansByOperator(op.id).subscribe({
      next: (plans) => { this.plans.set(plans); this.loadingPlans.set(false); },
      error: () => this.loadingPlans.set(false)
    });
  }

  selectPlan(plan: PlanResponse): void {
    this.selectedPlan.set(plan);
    this.form.patchValue({ planId: plan.id });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    this.rechargeService.initiateRecharge(this.form.value as any).subscribe({
      next: (res) => {
        this.result.set(res);
        this.success.set(true);
        this.loading.set(false);
        this.toast.success('Recharge successful!');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Recharge failed. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.success.set(false);
    this.result.set(null);
    this.selectedOperator.set(null);
    this.selectedPlan.set(null);
    this.plans.set([]);
    this.form.reset();
    this.error.set('');
  }
}
