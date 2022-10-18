import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../app-common.module';
import { TransactionParamsModule } from './transaction-params/transaction-params.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    TransactionParamsModule,
  ]
})
export class DialogsModule { }
