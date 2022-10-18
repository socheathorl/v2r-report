import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransactionParams } from '../../models/transaction-params';
import { FirstLastDayOfMonthService } from '../../services/first-last-day-of-month.service';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-transaction-params',
  templateUrl: './transaction-params.component.html',
  styleUrls: ['./transaction-params.component.scss']
})
export class TransactionParamsComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private masterDataService: MasterDataService,
  ) { }

  params: TransactionParams = new TransactionParams();
  @ViewChild('calendar') private calendar!: Calendar;
  dlgContainerHeight = '80vh';
  companies: any[] = [
    { value: 'Park', label: 'Park'}
  ];
  tenants: any[] = [];
  
  cards: any[] = [];

  ngOnInit(): void {
    this.masterDataService.getTenants().then(res => this.tenants = res);
    this.masterDataService.getCards().then(res => this.cards = res);
    this.params = this.config.data.reportParams;
    this.dlgContainerHeight = this.config.contentStyle['max-height'];
  }

  onDateRangeFilterSelected(value: Date) {
    if (this.params.dateRangeFilter[1]) {
      this.calendar.hideOverlay();
    }
  }

  onChange(event: any) {
    console.log(event);
    console.log(this.params);
  }

  runReport() {
    this.ref.close(this.params);
  }

}
