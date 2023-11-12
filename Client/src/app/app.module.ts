import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './features/shared/shared.module';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { CustomNgxDatetimeAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from './core/adapter/custom-date-time.adapter';
import { OUR_DATE_FORMAT, OUR_NGX_DATE_FORMAT } from './core/contracts/date-formats';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { StoreModule } from '@ngrx/store';
import { reducers } from './core/store';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule,
    SharedModule,
    MatNativeDateModule,
    MatDialogModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true
      }
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NgxMatDateAdapter, useClass: CustomNgxDatetimeAdapter, deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: NGX_MAT_DATE_FORMATS, useValue: OUR_NGX_DATE_FORMAT },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: OUR_DATE_FORMAT},
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
