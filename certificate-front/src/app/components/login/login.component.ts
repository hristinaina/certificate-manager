import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  hide: boolean = true;
  returnUrl!: string;
  submitted = false;
  notification!: DisplayMessage;

  radio : String = '';
  code: String = '';
  constructor(private router : Router, private userService: UserService, private authService: AuthService, 
              private _snackBar: MatSnackBar, private http: HttpClient) {}

  ngOnInit(): void { 
    this.authService.logout();
    this.submitted = false;
    this.radio = 'email';
  }

  loginWithGitHub() {
    const clientId = 'Iv1.17fb5574a2cb3f37';
    const redirectUri = 'http://localhost:4200/certificate'; // Your callback URL
  
    // Redirect the user to GitHub for authorization
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  login(): void { 
    console.log('login button pressed');

    if (this.radio == ''){
      this.openSnackBar("Must select an option for login verification!");
      return;
    }

    this.userService.checkLogin(this.loginForm.value, this.radio)
    .subscribe(data => {
        console.log('email/sms successfully sent');
        this.radio = 'email';
        this.notification = {msgType: '', msgBody: ''};
        this.submitted = true;
        },
    error => {
      console.log(error);
      if(error.error['message'] == "Password has expired!") {
        this.userService.setExpiredPassword(true);
        this.router.navigate(['/reset-password']);
      }
      else {
        this.submitted = false;
        this.notification = {msgType: 'error', msgBody: 'Incorrect username or password'};
      }
    });
  } 

  confirmLogin(){
    this.userService.login(this.loginForm.value, this.code)
    .subscribe(data => {
        localStorage.setItem("jwt", data.accessToken);
        this.authService.setToken(data.accessToken);
      
      console.log('Login success');
        this.userService.getMyInfo().subscribe((res:any) => {
          if(this.userService.currentUser != null) {
            this.router.navigate(['/certificate']);
          }
          });
        },
        error => {
          console.log(error);
          this.handleErrors(error);
          this.submitted = false;
        });
  }

  register() {
    this.router.navigate(['registration']);
  }

  radioChange(event: MatRadioChange) {
    this.radio = event.value;
  }

  handleErrors(error: any) {
    console.log(error);
    if(error.error.message!= null || error.error.message != undefined)  
    this.openSnackBar(error.error.message);
    else this.openSnackBar("Some error occurred");
  }

  openSnackBar(snackMsg : string) : void {
    this._snackBar.open(snackMsg, "Dismiss", {
      duration: 2000
    });
  }
}

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}
