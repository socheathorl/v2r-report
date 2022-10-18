import { NgModule } from '@angular/core';
import { AppPrimengModule } from './app-primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  imports: [],
  exports: [AppPrimengModule, FormsModule, ReactiveFormsModule],
  declarations: [],
})
export class AppCommonModule { }
