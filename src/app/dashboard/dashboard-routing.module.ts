import { CartComponent } from './cart/cart.component';
import { SavedComponent } from './saved/saved.component';
import { HistoryComponent } from './history/history.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { VerifyGuard } from './../../guards/verify.guard';
import { SettingsComponent } from './settings/settings.component';
import { IndexComponent } from './index/index.component';
import { BorrowedComponent } from './borrowed/borrowed.component';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: '', component: IndexComponent, pathMatch: 'full'},
    {path: 'borrowed', component: BorrowedComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'search', component: SearchResultsComponent},
    {path: 'books/:id', component: BookDetailsComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'saved-items', component: SavedComponent},
    {path: 'cart', component: CartComponent}
  ], canActivate: [VerifyGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
