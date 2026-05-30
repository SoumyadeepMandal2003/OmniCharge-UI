import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Auth routes (no layout)
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Protected routes (with layout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'recharge',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/recharge/new-recharge/new-recharge.component').then(m => m.NewRechargeComponent)
          },
          {
            path: 'history',
            loadComponent: () => import('./features/recharge/recharge-history/recharge-history.component').then(m => m.RechargeHistoryComponent)
          }
        ]
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'operators',
        loadComponent: () => import('./features/operators/operators.component').then(m => m.OperatorsComponent)
      },
      {
        path: 'plans',
        loadComponent: () => import('./features/plans/plans.component').then(m => m.PlansComponent)
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
          },
          {
            path: 'change-password',
            loadComponent: () => import('./features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent)
          }
        ]
      },
      // Admin routes
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: 'users',
            loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent)
          },
          {
            path: 'operators',
            loadComponent: () => import('./features/admin/operators/admin-operators.component').then(m => m.AdminOperatorsComponent)
          },
          {
            path: 'plans',
            loadComponent: () => import('./features/admin/plans/admin-plans.component').then(m => m.AdminPlansComponent)
          },
          {
            path: 'transactions',
            loadComponent: () => import('./features/admin/transactions/admin-transactions.component').then(m => m.AdminTransactionsComponent)
          }
        ]
      }
    ]
  },

  // 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
