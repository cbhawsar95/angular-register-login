import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AlertService, UserService, AuthenticationService } from "../_services";
import { of } from "rxjs";

@Component({ templateUrl: "register.component.html" })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  cities: { id: string; name: string }[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
        ]
      ],
      mobileno: ["", [Validators.required, Validators.minLength(10)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      roomno: ["", [Validators.required, Validators.minLength(2)]],
      dob: ["", Validators.required],
      cities: ["", Validators.required],
      notes: ["", Validators.required]
    });
    //Sync cities
    // this.cities = this.getCities();
    // this.registerForm.controls.cities.patchValue(this.cities[0].name);

    // async orders
    of(this.getCities()).subscribe(cities => {
      this.cities = cities;
      this.registerForm.controls.cities.patchValue(this.cities[0].name);
    });
  }

  getCities() {
    return [
      { id: "1", name: "Indore" },
      { id: "2", name: "Bhopal" },
      { id: "3", name: "Pune" },
      { id: "4", name: "Delhi" }
    ];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
