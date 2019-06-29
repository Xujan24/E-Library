import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { IndexComponent } from './index/index.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { InvertQueryPipe } from '../../pipes/invert-query.pipe';
import { BookDetailsComponent } from './book-details/book-details.component';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { ControlsComponent } from './controls/controls.component';
import { HistoryComponent } from './history/history.component';
import { SavedComponent } from './saved/saved.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CartComponent } from './cart/cart.component';
import { CartItemCounterComponent } from './cart-item-counter/cart-item-counter.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { ChangeProfileImageComponent } from './change-profile-image/change-profile-image.component';

@NgModule({
  declarations: [
    DashboardComponent,
    BorrowedComponent,
    IndexComponent,
    SettingsComponent,
    SearchResultsComponent,
    TruncatePipe,
    InvertQueryPipe,
    BookDetailsComponent,
    AdvanceSearchComponent,
    ControlsComponent,
    HistoryComponent,
    SavedComponent,
    SpinnerComponent,
    CartComponent,
    CartItemCounterComponent,
    DateFormatPipe,
    ChangeProfileImageComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [DashboardComponent]
})
export class DashboardModule { }
