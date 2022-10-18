export class TransactionParams {
  constructor() {
    this.dateRangeFilter = [];
  }

  // when
  dateRangeFilter: (Date | string | null)[];

  // where
  company?: { value: string, label: string };
  tenant?: { value: string, label: string };

  // what
  card?: { value: string, label: string, text: string };
  // who
}
