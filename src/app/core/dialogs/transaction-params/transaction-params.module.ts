import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionParamsComponent } from './transaction-params.component';
import { AppCommonModule } from '../../../app-common.module';



@NgModule({
  declarations: [
    TransactionParamsComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
  ]
})
export class TransactionParamsModule { }
