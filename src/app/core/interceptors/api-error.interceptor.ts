import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiFeedbackService } from '../services/ui-feedback.service';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private uiFeedbackService: UiFeedbackService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message =
          this.mapAdminContractError(req, error) ||
          error.error?.title ||
          error.error?.message ||
          error.error?.detail ||
          error.message ||
          'Ocurrio un error inesperado en la solicitud.';

        console.error(`[HTTP ${req.method}] ${req.url}`, message, error);
        this.uiFeedbackService.showError(message);

        return throwError(() => ({
          ...error,
          message
        }));
      })
    );
  }

  private mapAdminContractError(
    req: HttpRequest<unknown>,
    error: HttpErrorResponse
  ): string | null {
    const adminWriteRequest =
      (req.method === 'POST' || req.method === 'PUT') &&
      (/\/api\/admin\/surveys(\/\d+)?$/.test(req.url) ||
        /\/api\/admin\/surveys\/\d+\/sections$/.test(req.url) ||
        /\/api\/admin\/sections\/\d+\/questions$/.test(req.url) ||
        /\/api\/admin\/questions\/\d+\/options$/.test(req.url) ||
        /\/api\/admin\/surveys\/\d+\/rules$/.test(req.url));

    if (!adminWriteRequest) {
      return null;
    }

    if (error.status === 404 || error.status === 405) {
      return 'El backend no acepta ese endpoint de administracion o el metodo HTTP no coincide con el contrato publicado.';
    }

    return null;
  }
}
