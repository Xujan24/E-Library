import { ControlsComponent } from './controls/controls.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UserAuthService } from './../../services/user-auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showDropdown = false;
  showMenuItems = false;

  displayName = '';
  photoUrl = '';
  userEmail = '' ;
  queryString = '';

  cartItemCount = 0;

  constructor (
    private userAuth: UserAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cart: CartService
  ) {
    this.getUserInfo();
  }

  ngOnInit() {}

  getUserInfo(): void{
    this.userAuth.getCurrentUser().then(user => {
      if (user) {
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;
        this.userEmail = user.email;
      }
    });
  }

  toggleDropdown(): void{
    // this.getUserInfo();
    this.showDropdown = !this.showDropdown;
  }

  toggleMenuItems(): void{
    this.showMenuItems = !this .showMenuItems;
  }

  logout(): void{
    this.userAuth.logout().then(
      success => {
        this.router.navigate(['/login']);
      }, error => console.log(error.message));
  }

  search(): void{
    const qS = this.queryString.split(' ').join('+');
    this.router.navigate(['/dashboard/search'], {
      relativeTo: this.route,
      queryParams: {q: qS}
    });
  }

}
