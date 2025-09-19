import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../Services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfilePage {
  auth = inject(AuthService);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  success = signal('');

  profile = signal<UserProfile>({ displayName: '', email: '', phone: '' });

  ngOnInit() {
    // Prefill from current session immediately
    const sessionUser = this.auth.getUser();
    if (sessionUser) {
      const current = this.profile();
      this.profile.set({
        ...current,
        displayName: sessionUser.displayName || current.displayName,
        email: sessionUser.email || current.email
      });
      this.loading.set(false);
    }

    // Then try to load fresh data from API
    this.auth.getProfile().subscribe({
      next: (p) => { this.profile.set(p); this.loading.set(false); },
      error: () => { this.error.set('Failed to load profile'); this.loading.set(false); }
    });
  }

  save() {
    this.saving.set(true);
    this.auth.updateProfile(this.profile()).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.error.set('');
        this.success.set('Profile updated successfully.');
        this.saving.set(false);
        setTimeout(() => this.success.set(''), 2500);
      },
      error: () => { this.error.set('Failed to save'); this.saving.set(false); }
    });
  }

  changePassword = { currentPassword: '', newPassword: '' };
  savingPwd = signal(false);
  savePassword() {
    this.savingPwd.set(true);
    this.auth.changePassword(this.changePassword).subscribe({
      next: () => {
        this.savingPwd.set(false);
        this.changePassword = { currentPassword: '', newPassword: '' };
        this.error.set('');
        this.success.set('Password updated successfully.');
        setTimeout(() => this.success.set(''), 2500);
      },
      error: () => { this.savingPwd.set(false); this.error.set('Failed to change password'); }
    });
  }

  // Helpers to update signal safely (Angular template doesn't support object spread)
  setDisplayName(value: string) {
    const p = this.profile();
    this.profile.set({ ...p, displayName: value });
  }
  setEmail(value: string) {
    const p = this.profile();
    this.profile.set({ ...p, email: value });
  }
  setPhone(value: string) {
    const p = this.profile();
    this.profile.set({ ...p, phone: value });
  }
}


