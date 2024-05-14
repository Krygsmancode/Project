import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../services/module.service';

@Component({
  selector: 'app-module-registration',
  templateUrl: './module-registration.component.html',
  styleUrls: ['./module-registration.component.scss']
})
export class ModuleRegistrationComponent implements OnInit {
  userId: string = ''; // You'll need to obtain the user's ID from the login process
  modules: any[] = []; // Array to store the fetched modules
  registeredModules: any[] = [];

  constructor(private moduleService: ModuleService) { }
  newModuleCode: string = '';
newModuleName: string = '';
newModuleCredits: number = 0;

showAddModuleForm: boolean = false;

  toggleAddModuleForm() {
    this.showAddModuleForm = !this.showAddModuleForm;
  }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser.userId; // Set the userId to the logged-in user's ID

    this.fetchModules();
    this.fetchRegisteredModules(); 

  }

  fetchModules() {
    this.moduleService.getModules().subscribe(
      (response: any[]) => {
        this.modules = response;
      },
      error => {
        console.error('Error fetching modules:', error);
      }
    );
  }

  fetchRegisteredModules() {
    this.moduleService.getRegisteredModules(this.userId).subscribe(
      response => {
        this.registeredModules = response;
      },
      error => {
        console.error('Error fetching registered modules:', error);
      }
    );
  }
  

  onAddModule() {
    const newModule = {
      moduleCode: this.newModuleCode,
      moduleName: this.newModuleName,
      credits: this.newModuleCredits
    };
    this.moduleService.addModule(newModule).subscribe(
      response => {
        console.log('Module added successfully:', response);
        this.fetchModules(); // Refresh the module list
      },
      error => {
        console.error('Error adding module:', error);
      }
    );
  }

  onRegisterModule(moduleCode: string) {
    this.moduleService.registerModule(this.userId, moduleCode).subscribe(
      response => {
        console.log('Module registration successful:', response);
        // Optionally, update the UI or navigate to another page
      },
      error => {
        console.error('Module registration error:', error);
      }
    );
  }
}
