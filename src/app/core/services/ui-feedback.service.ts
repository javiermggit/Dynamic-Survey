import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UiToast {
  id: number;
  type: 'error' | 'info' | 'success';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiFeedbackService {
  private loadingCount = 0;
  private readonly loadingCountSubject = new BehaviorSubject(0);
  private readonly toastsSubject = new BehaviorSubject<UiToast[]>([]);
  private nextId = 1;

  readonly loading$ = this.loadingCountSubject.asObservable();
  readonly toasts$ = this.toastsSubject.asObservable();

  showError(message: string): void {
    this.pushToast('error', message);
  }

  showInfo(message: string): void {
    this.pushToast('info', message);
  }

  showSuccess(message: string): void {
    this.pushToast('success', message);
  }

  removeToast(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  beginLoading(): void {
    this.loadingCount += 1;
    this.emitLoadingCount();
  }

  endLoading(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.emitLoadingCount();
  }

  private pushToast(type: UiToast['type'], message: string): void {
    const toast: UiToast = {
      id: this.nextId++,
      type,
      message
    };

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => this.removeToast(toast.id), 5000);
  }

  private emitLoadingCount(): void {
    queueMicrotask(() => {
      this.loadingCountSubject.next(this.loadingCount);
    });
  }
}
