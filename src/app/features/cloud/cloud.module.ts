import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudRoutingModule } from './cloud-routing.module';
import { CloudComponent } from './cloud.component';
import { AppCommonModule } from '../../app-common.module';


@NgModule({
  declarations: [
    CloudComponent
  ],
  imports: [
    CommonModule,
    CloudRoutingModule,
    AppCommonModule,
  ]
})
export class CloudModule { }
