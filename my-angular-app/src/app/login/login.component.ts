import { Component } from '@angular/core';
import { AuthService } from '../services/AuthService'; // Adjust the import path if necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful:', response);
        this.router.navigate(['/module-registration']); // Navigate to the module registration page
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = error.error.message || 'Login failed. Please try again.';
      }
    );
  }
}
