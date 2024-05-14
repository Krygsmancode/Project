import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages
  successMessage: string = ''; // To display success messages

  constructor(private userService: UserService, private router: Router) { }

  onRegister() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }
    console.log(this.email + " "+this.password)
  
    this.userService.register(this.email, this.password).subscribe(
      response => {
        console.log('Registration successful:', response);
        this.successMessage = 'Registration successful! You can now log in.';
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate to the login page after a short delay
        }, 2000);
      },
      error => {
        console.error('Registration error:', error);
        if (error.status === 400 && error.error.message === 'A user with this email already exists') {
          this.errorMessage = 'A user with this email already exists. Please use a different email.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        this.successMessage = '';
      }
    );
  }
  
}
