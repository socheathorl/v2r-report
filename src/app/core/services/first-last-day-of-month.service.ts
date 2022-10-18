import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirstLastDayOfMonthService {
  constructor(private datePipe: DatePipe) {}

  calculate(date: Date, format?: string) {
    let result: { first: Date| string | null, last: Date | string | null } = { first: null, last: null};
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    result = {
      first: firstDay,
      last: lastDay,
    };
    if (format) {
      const FirstDate = this.datePipe.transform(firstDay, format);
      const LastDate = this.datePipe.transform(lastDay, format);
      result = {
        first: FirstDate,
        last: LastDate,
      };
    }
    return result;
  }
}
