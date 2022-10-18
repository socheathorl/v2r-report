import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as _ from "underscore";
import { Product } from '../../core/models/products';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FirstLastDayOfMonthService } from '../../core/services/first-last-day-of-month.service';
import { TransactionParamsComponent } from '../../core/dialogs/transaction-params/transaction-params.component';
import { TransactionParams } from '../../core/models/transaction-params';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private firstLastDayOfMonthService: FirstLastDayOfMonthService,
    private http: HttpClient,
  ) {}
  menuItems: MenuItem[] = [];
  cards: any[] = [];
  cardsSkeleton: any[] = [];
  transactionSkeleton: any[] = [];
  private cardCache = new Map();
  private transactionCache = new Map();
  rawProducts: Product[] = [];
  paginationData: any = {
    page: 0, 
    first: 0, 
    rows: 25,
    pageCount: 1,
    totalRecords: 25
  };
  loading: boolean = true;
  infoLoading: boolean = true;
  transactionLoading: boolean = true;
  expandCard: string = '';
  rowHeight: string = '2.8125rem';
  tableWrapperHeight: string = '400px';
  @ViewChild("tblReport") private tblReport!: Table;
  searchKey: string = '';

  // dialog parameters
  paramDialogRef: DynamicDialogRef = new DynamicDialogRef();
  reportParams: TransactionParams = new TransactionParams();

  ngOnInit(): void {
    this.menuItems = [
      {
        label: "Parameters",
        icon: "pi pi-filter",
        command: () => this.onShowParamsDialog()
      },
      {
        label: "Export",
        icon: "pi pi-file-excel",
      }
    ];

    this.setHeightTable();
    this.loading = true;
    this.infoLoading = true;
    this.loadingMasterIndicator();
    this.onShowParamsDialog();
  }

  loadingMasterIndicator() {
    let cardsSkeleton = [];
    for (let index = 0; index < this.paginationData.rows; index++) {
      let card = {
        card_cd: `${index}`,
        card_number: '',
        card_name: '',
        transactions: []
      };
      cardsSkeleton.push(card);
    }
    this.cardsSkeleton = [...cardsSkeleton];
  }

  loadingDetailIndicator() {
    let transactionSkeleton = [];
    for (let index = 0; index < 5; index++) {
      let transaction = {
        id: `${index}`,
        transactionDate: '',
        company: '',
        tenant: '',
        debit: {
          balance: 0,
          point: 0
        },
        credit: {
          balance: 0,
          point: 0
        }
      };
      transactionSkeleton.push(transaction);
    }
    this.transactionSkeleton = [...transactionSkeleton];
  }

  setHeightTable() {
    setTimeout(() => {
      const tableWrapper = document.getElementById("table-wrapper");
      this.tableWrapperHeight = `${tableWrapper?.getBoundingClientRect().height}px`;
    });
  }

  getMasterData() {
    this.infoLoading = false;
    let dateFilter = this.reportParams.dateRangeFilter.length == 2
      ? `&fdate=${moment(this.reportParams.dateRangeFilter[0]).format('YYYY-MM-DD')}&tdate=${moment(this.reportParams.dateRangeFilter[1]).format('YYYY-MM-DD')}`
      : '';

    let companyFilter = this.reportParams.company
      ? `&company=${this.reportParams.company.value}`
      : '';
    let tenantFilter = this.reportParams.tenant
      ? `&tenant=${this.reportParams.tenant.value}`
      : '';
    let cardFilter = this.reportParams.card
      ? `&card=${this.reportParams.card.value}`
      : '';
    
    let query = `?skip=${this.paginationData.first}&take=${this.paginationData.rows}${dateFilter}${companyFilter}${tenantFilter}${cardFilter}`;

    let cache = this.cardCache.get(query);
    if (cache) {
      this.paginationData.totalRecords = cache.count;
      this.cards = cache.data;
      this.loading = false;
      return;
    }

    this.http.get<any>(`https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/cards${query}`).subscribe(res => {
      this.cardCache.set(query, res);
      this.paginationData.totalRecords = res?.count;
      this.cards = res?.data.map((t: any) => {
        t.transactions = [];
        return t;
      });
      this.loading = false;
    });
  }

  getDetailData(transaction: any) {
    let dateFilter = this.reportParams.dateRangeFilter.length == 2
      ? `&fdate=${moment(this.reportParams.dateRangeFilter[0]).format('YYYY-MM-DD')}&tdate=${moment(this.reportParams.dateRangeFilter[1]).format('YYYY-MM-DD')}`
      : '';
    
    let query = `?skip=0&take=${this.paginationData.rows}${dateFilter}`;
    let url = `https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/cards/${transaction.card_cd}/transactions${query}`

    let cache = this.transactionCache.get(url);
    if (cache) {
      this.transactionLoading = false;
      return;
    }
    
    this.http.get<any>(url).subscribe(res => {
      this.transactionCache.set(url, res);
      let transactions = res?.data.map((t: any) => {
        let debit = {
          balance: 0,
          point: 0
        };

        let credit = {
          balance: 0,
          point: 0
        };


        if (t.earning_multiply === 0) {
          // begining
          debit = {
            balance: t.begining_balance,
            point: t.begining_point
          };
        } else if (t.earning_multiply === 1) {
          // debit
          debit = {
            balance: t.value_balance,
            point: t.value_point
          };
        } else if (t.earning_multiply === -1) {
          // credit
          credit = {
            balance: t.value_balance,
            point: t.value_point
          };
        }
        let transaction = {
          id: t.id,
          transactionDate: moment(t.transaction_date_time).format('DD/MM/YYYY HH:mm:ss'),
          company: t.company,
          tenant: t.tenant,
          debit: debit,
          credit: credit
        };
        return transaction;
      });
      transaction.transactions = transactions;
      this.transactionLoading = false;
    });
  }

  onShowParamsDialog() {
    this.loading = true;
    // parameters
    const dateRangeFilter = this.reportParams.dateRangeFilter.length ?
      this.reportParams.dateRangeFilter : [
        this.firstLastDayOfMonthService.calculate(new Date()).first,
        this.firstLastDayOfMonthService.calculate(new Date()).last,
      ];
    
    const reportParams: TransactionParams = {
      dateRangeFilter: dateRangeFilter,
      company: this.reportParams.company,
      tenant: this.reportParams.tenant,
      card: this.reportParams.card
    };

    // open dialog
    this.paramDialogRef = this.dialogService.open(TransactionParamsComponent, {
      header: 'TRANSACTION PARAMETERS',
      dismissableMask: true,
      contentStyle: {
        "min-height": "20vh",
        "max-height": "80vh",
        width: "40vw",
        "overflow-y": "hidden"
      },
      styleClass: 'dialog-custom',
      data: {
        reportParams: reportParams,
      },
    });

    // close dialog
    this.paramDialogRef.onClose.subscribe((result: TransactionParams) => {
      if(result) {
        this.cardCache.clear();
        this.transactionCache.clear();
        this.reportParams = result;
        this.getMasterData();
      }
    });
  }

  onRowExpand(event: any) {
    let expandedTransaction = event.data;
    this.expandCard = expandedTransaction.card_cd;
    this.transactionLoading = true;
    this.loadingDetailIndicator();
    this.getDetailData(expandedTransaction);
  }

  onRowCollapse(event: any) {
  }

  onPageChange(event: any) {
    this.loading = true;
    this.paginationData = { ...this.paginationData, ...event};
    this.loadingMasterIndicator();
    this.getMasterData();
  }

  onSearch(event: any) {
    this.tblReport?.filterGlobal(event.target.value, "contains");
  }
}
