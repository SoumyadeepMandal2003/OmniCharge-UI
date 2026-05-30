import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperatorService } from '../../../core/services/operator.service';
import { ToastService } from '../../../core/services/toast.service';
import { OperatorResponse, OperatorRequest } from '../../../core/models/operator.models';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-operators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, ConfirmModalComponent],
  template: `
    <div class="animate-fade-in">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="page-title">Manage Operators</h1>
          <p class="page-subtitle">Create and manage telecom operators</p>
        </div>
        <button class="btn-primary" (click)="openCreate()">+ Add Operator</button>
      </div>

      <div class="card">
        @if (loading()) {
          <app-spinner label="Loading operators..."/>
        } @else if (operators().length === 0) {
          <div style="text-align:center;padding:32px 0;">
            <div style="font-size:40px;margin-bottom:12px;">📡</div>
            <p style="color:var(--text-secondary);margin-bottom:16px;">No operators yet.</p>
            <button class="btn-primary" (click)="openCreate()">Add First Operator</button>
          </div>
        } @else {
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th class="table-header">ID</th>
                  <th class="table-header">Name</th>
                  <th class="table-header">Code</th>
                  <th class="table-header">Description</th>
                  <th class="table-header">Status</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (op of operators(); track op.id) {
                  <tr class="table-row">
                    <td class="table-cell" style="color:var(--text-muted);font-size:12px;">#{{ op.id }}</td>
                    <td class="table-cell"><strong style="color:var(--text-primary);">{{ op.name }}</strong></td>
                    <td class="table-cell"><span style="font-family:monospace;font-size:12px;color:var(--text-secondary);">{{ op.code }}</span></td>
                    <td class="table-cell" style="color:var(--text-secondary);">{{ op.description || '—' }}</td>
                    <td class="table-cell">
                      <span [ngClass]="op.active ? 'badge-success' : 'badge-danger'">{{ op.active ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="table-cell">
                      <div style="display:flex;gap:6px;">
                        <button class="btn-secondary btn-sm" (click)="openEdit(op)">✏️ Edit</button>
                        <button class="btn-danger btn-sm" (click)="confirmDelete(op)">Deactivate</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Add/Edit Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div style="padding:28px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
              <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2));display:flex;align-items:center;justify-content:center;font-size:18px;">
                📡
              </div>
              <h3 style="font-size:17px;font-weight:700;color:var(--text-primary);">
                {{ editingId() ? 'Edit Operator' : 'Add Operator' }}
              </h3>
            </div>

            @if (formError()) { <div class="alert-error">{{ formError() }}</div> }

            <form [formGroup]="form" (ngSubmit)="onSave()">
              <div class="form-group">
                <label class="label">Name *</label>
                <input type="text" formControlName="name" class="input-field"
                  [class.input-error]="f['name'].invalid && f['name'].touched"
                  placeholder="e.g. Jio" maxlength="50"/>
                @if (f['name'].invalid && f['name'].touched) {
                  <p style="color:var(--danger);font-size:12px;margin-top:5px;">Name is required</p>
                }
              </div>
              <div class="form-group">
                <label class="label">Code *</label>
                <input type="text" formControlName="code" class="input-field"
                  [class.input-error]="f['code'].invalid && f['code'].touched"
                  placeholder="e.g. JIO" maxlength="10"/>
                @if (f['code'].invalid && f['code'].touched) {
                  <p style="color:var(--danger);font-size:12px;margin-top:5px;">Code is required</p>
                }
              </div>
              <div class="form-group">
                <label class="label">Description</label>
                <textarea formControlName="description" class="input-field" rows="2" placeholder="Optional description"></textarea>
              </div>
              <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <span style="display:inline-flex;align-items:center;gap:6px;">
                      <span class="spinner-gradient sm animate-spin"></span>
                      {{ editingId() ? 'Updating...' : 'Creating...' }}
                    </span>
                  } @else {
                    {{ editingId() ? '✅ Update' : '✅ Create' }}
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
      title="Deactivate Operator"
      [message]="'Deactivate ' + (deleteTarget()?.name ?? '') + '? This will also affect associated plans.'"
      confirmLabel="Deactivate"
      (confirmed)="onDelete()"
      (cancelled)="showConfirm.set(false)"/>
  `
})
export class AdminOperatorsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private operatorService = inject(OperatorService);
  private toast = inject(ToastService);

  loading      = signal(true);
  saving       = signal(false);
  showModal    = signal(false);
  showConfirm  = signal(false);
  formError    = signal('');
  editingId    = signal<number | null>(null);
  deleteTarget = signal<OperatorResponse | null>(null);
  operators    = signal<OperatorResponse[]>([]);

  form = this.fb.group({
    name:        ['', [Validators.required, Validators.maxLength(50)]],
    code:        ['', [Validators.required, Validators.maxLength(10)]],
    description: ['']
  });

  get f() { return this.form.controls; }

  ngOnInit(): void { this.loadOperators(); }

  loadOperators(): void {
    this.loading.set(true);
    this.operatorService.getAllOperators().subscribe({
      next: (data) => { this.operators.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreate(): void { this.editingId.set(null); this.form.reset(); this.formError.set(''); this.showModal.set(true); }
  openEdit(op: OperatorResponse): void {
    this.editingId.set(op.id);
    this.form.patchValue({ name: op.name, code: op.code, description: op.description });
    this.formError.set('');
    this.showModal.set(true);
  }
  closeModal(): void { this.showModal.set(false); this.form.reset(); }

  onSave(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.formError.set('');
    const req = this.form.value as OperatorRequest;
    const obs = this.editingId()
      ? this.operatorService.updateOperator(this.editingId()!, req)
      : this.operatorService.createOperator(req);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadOperators();
        this.toast.success(this.editingId() ? 'Operator updated!' : 'Operator created!');
      },
      error: (err) => { this.saving.set(false); this.formError.set(err.error?.message ?? 'Operation failed'); }
    });
  }

  confirmDelete(op: OperatorResponse): void { this.deleteTarget.set(op); this.showConfirm.set(true); }
  onDelete(): void {
    const id = this.deleteTarget()?.id;
    if (!id) return;
    this.showConfirm.set(false);
    this.operatorService.deactivateOperator(id).subscribe({
      next: () => { this.loadOperators(); this.toast.success('Operator deactivated'); },
      error: () => this.toast.error('Failed to deactivate')
    });
  }
}
