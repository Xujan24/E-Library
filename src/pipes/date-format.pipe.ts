import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, format?: string): any {
    return formatDate(value.toDate(), format || 'medium', 'en-US');
  }

}
