import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, Subject, catchError, filter, switchMap, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshSubject = new Subject<boolean>();

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);

  const token = localStorage.getItem('rb_token');
  const withAuth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(withAuth).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Avoid trying to refresh on refresh endpoint itself
        if (withAuth.url.includes('/api/Account/refresh-token')) {
          auth.logout();
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(false);
          return auth.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshSubject.next(true);
              const newToken = localStorage.getItem('rb_token') || '';
              const retryReq = withAuth.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next(retryReq);
            }),
            catchError(refreshErr => {
              isRefreshing = false;
              auth.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          // Queue until refresh completes
          return refreshSubject.pipe(
            filter(done => done === true),
            take(1),
            switchMap(() => {
              const newToken = localStorage.getItem('rb_token') || '';
              const retryReq = withAuth.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              return next(retryReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};


