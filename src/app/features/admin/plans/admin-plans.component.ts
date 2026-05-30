import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { OperatorService } from '../../../core/services/operator.service';
import { ToastService } from '../../../core/services/toast.service';
import { PlanResponse, PlanRequest, OperatorResponse, PLAN_TYPES } from '../../../core/models/operator.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SpinnerComponent, ConfirmModalComponent],
  template: `
    <div class="animate-fade-in">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="page-title">Manage Plans</h1>
          <p class="page-subtitle">Create and manage recharge plans</p>
        </div>
        <button class="btn-primary" (click)="openCreate()">+ Add Plan</button>
      </div>

      <!-- Filters -->
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;align-items:center;">
        <select [(ngModel)]="operatorFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:170px;">
          <option value="">All Operators</option>
          @for (op of operators(); track op.id) { <option [value]="op.id">{{ op.name }}</option> }
        </select>
        <select [(ngModel)]="typeFilter" (ngModelChange)="applyFilter()" class="input-field" style="width:150px;">
          <option value="">All Types</option>
          @for (t of planTypes; track t) { <option [value]="t">{{ t }}</option> }
        </select>
        <span style="font-size:13px;color:var(--text-muted);">{{ filtered().length }} plans</span>
      </div>

      <div class="card">
        @if (loading()) {
          <app-spinner label="Loading plans..."/>
        } @else if (filtered().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">📦</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">No plans found.</p>
            <button class="btn-primary" (click)="openCreate()">Add First Plan</button>
          </div>
        } @else {
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">Name</th>
                  <th class="table-header">Operator</th>
                  <th class="table-header">Price</th>
                  <th class="table-header">Validity</th>
                  <th class="table-header">Data</th>
                  <th class="table-header">Type</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (p of filtered(); track p.id) {
                  <tr class="table-row">
                    <td class="table-cell"><strong style="color:var(--text-primary);">{{ p.name }}</strong></td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ p.operatorName }}</td>
                    <td class="table-cell"><strong style="color:var(--text-primary);">₹{{ p.price }}</strong></td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ p.validityDays }}d</td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ p.data || '—' }}</td>
                    <td class="table-cell"><span [ngClass]="typeBadge(p.type)">{{ p.type }}</span></td>
                    <td class="table-cell"><span [ngClass]="p.active ? 'badge-success' : 'badge-danger'">{{ p.active ? 'Active' : 'Inactive' }}</span></td>
                    <td class="table-cell">
                      <button class="btn-danger btn-sm" (click)="confirmDelete(p)">Deactivate</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Add Plan Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-box" style="max-width:560px;" (click)="$event.stopPropagation()">
          <div style="padding:28px;max-height:90vh;overflow-y:auto;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
              <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2));display:flex;align-items:center;justify-content:center;font-size:18px;">
                📦
              </div>
              <h3 style="font-size:17px;font-weight:700;color:var(--text-primary);">Add New Plan</h3>
            </div>

            @if (formError()) { <div class="alert-error">{{ formError() }}</div> }

            <form [formGroup]="form" (ngSubmit)="onSave()">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div class="form-group" style="grid-column:1/-1;margin-bottom:0;">
                  <label class="label">Plan Name *</label>
                  <input type="text" formControlName="name" class="input-field"
                    [class.input-error]="f['name'].invalid && f['name'].touched"
                    placeholder="e.g. Unlimited 28 Days" maxlength="100"/>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Operator *</label>
                  <select formControlName="operatorId" class="input-field" [class.input-error]="f['operatorId'].invalid && f['operatorId'].touched">
                    <option value="">Select operator</option>
                    @for (op of operators(); track op.id) { <option [value]="op.id">{{ op.name }}</option> }
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Type *</label>
                  <select formControlName="type" class="input-field" [class.input-error]="f['type'].invalid && f['type'].touched">
                    <option value="">Select type</option>
                    @for (t of planTypes; track t) { <option [value]="t">{{ t }}</option> }
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Price (₹) *</label>
                  <input type="number" formControlName="price" class="input-field"
                    [class.input-error]="f['price'].invalid && f['price'].touched"
                    placeholder="239" min="1" step="0.01"/>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Validity (days) *</label>
                  <input type="number" formControlName="validityDays" class="input-field"
                    [class.input-error]="f['validityDays'].invalid && f['validityDays'].touched"
                    placeholder="28" min="1"/>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Data</label>
                  <input type="text" formControlName="data" class="input-field" placeholder="1.5GB/day"/>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">Calls</label>
                  <input type="text" formControlName="calls" class="input-field" placeholder="Unlimited"/>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="label">SMS</label>
                  <input type="text" formControlName="sms" class="input-field" placeholder="100/day"/>
                </div>
                <div class="form-group" style="grid-column:1/-1;margin-bottom:0;">
                  <label class="label">Description</label>
                  <textarea formControlName="description" class="input-field" rows="2" placeholder="Optional description"></textarea>
                </div>
              </div>
              <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <span style="display:inline-flex;align-items:center;gap:6px;">
                      <span class="spinner-gradient sm animate-spin"></span> Creating...
                    </span>
                  } @else {
                    ✅ Create Plan
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }

    <app-confirm-modal
      [visible]="showConfirm()"
      title="Deactivate Plan"
      [message]="'Deactivate plan: ' + (deleteTarget()?.name ?? '') + '?'"
      confirmLabel="Deactivate"
      (confirmed)="onDelete()"
      (cancelled)="showConfirm.set(false)"/>
  `
})
export class AdminPlansComponent implements OnInit {
  private fb = inject(FormBuilder);
  private operatorService = inject(OperatorService);
  private toast = inject(ToastService);

  planTypes    = PLAN_TYPES;
  loading      = signal(true);
  saving       = signal(false);
  showModal    = signal(false);
  showConfirm  = signal(false);
  formError    = signal('');
  deleteTarget = signal<PlanResponse | null>(null);
  plans        = signal<PlanResponse[]>([]);
  filtered     = signal<PlanResponse[]>([]);
  operators    = signal<OperatorResponse[]>([]);
  operatorFilter: string | number = '';
  typeFilter = '';

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.maxLength(100)]],
    price:       [null as number | null, [Validators.required, Validators.min(1)]],
    validityDays:[null as number | null, [Validators.required, Validators.min(1)]],
    data:        [''], calls: [''], sms: [''], description: [''],
    type:        ['', Validators.required],
    operatorId:  [null as number | null, Validators.required]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.operatorService.getAllOperators().subscribe({ next: (ops) => this.operators.set(ops) });
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.operatorService.getAllPlans().subscribe({
      next: (data) => { this.plans.set(data); this.filtered.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    let result = this.plans();
    if (this.operatorFilter) result = result.filter(p => p.operatorId === +this.operatorFilter);
    if (this.typeFilter) result = result.filter(p => p.type === this.typeFilter);
    this.filtered.set(result);
  }

  openCreate(): void { this.form.reset(); this.formError.set(''); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); this.form.reset(); }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.formError.set('');
    this.operatorService.createPlan(this.form.value as PlanRequest).subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.loadPlans(); this.toast.success('Plan created!'); },
      error: (err) => { this.saving.set(false); this.formError.set(err.error?.message ?? 'Failed to create plan'); }
    });
  }

  confirmDelete(p: PlanResponse): void { this.deleteTarget.set(p); this.showConfirm.set(true); }
  onDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.showConfirm.set(false);
    this.operatorService.deactivatePlan(id).subscribe({
      next: () => { this.loadPlans(); this.toast.success('Plan deactivated'); },
      error: () => this.toast.error('Failed to deactivate plan')
    });
  }

  typeBadge(type: string): string {
    const map: Record<string, string> = {
      'PREPAID': 'badge-success', 'POSTPAID': 'badge-info',
      'DATA': 'badge-warning', 'TALKTIME': 'badge-gray', 'COMBO': 'badge-purple'
    };
    return map[type] ?? 'badge-gray';
  }
}
