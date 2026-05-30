import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg-gradient);background-attachment:fixed;">
      <div class="glass-card animate-slide-up" style="text-align:center;max-width:480px;padding:56px 40px;">
        <!-- Glowing 404 -->
        <div style="font-size:96px;font-weight:900;background:linear-gradient(135deg,#6366f1,#a78bfa,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:8px;filter:drop-shadow(0 0 30px rgba(99,102,241,0.4));">
          404
        </div>

        <div style="font-size:40px;margin-bottom:16px;">🔭</div>

        <h2 style="font-size:22px;font-weight:700;color:var(--text-primary);margin-bottom:10px;">
          Page Not Found
        </h2>
        <p style="color:var(--text-secondary);font-size:14px;line-height:1.6;margin-bottom:32px;">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a routerLink="/dashboard" class="btn-primary">🏠 Go to Dashboard</a>
          <button onclick="history.back()" class="btn-secondary">← Go Back</button>
        </div>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
