import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invertQuery'
})
export class InvertQueryPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    const str: string = value;
    return str.split("+").join(' ');
  }

}
