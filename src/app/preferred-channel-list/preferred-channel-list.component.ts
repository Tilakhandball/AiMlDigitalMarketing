import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-preferred-channel-list',
  templateUrl: './preferred-channel-list.component.html',
  styleUrls: ['./preferred-channel-list.component.scss']
})
export class PreferredChannelListComponent implements OnInit {
  calculatedBudget: any;
  budgetCalcTitle = 'Optimal Channel Level Budget';
  constructor(
    public dialogRef: MatDialogRef<PreferredChannelListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.calculatedBudget = this.data;
  }

  get key() {
    return Object.keys(this.calculatedBudget);
  }

  closeDialog = () => {
    this.dialogRef.close();
  }

  download = () => {
    let data = [];
    Object.keys(this.calculatedBudget).forEach(element => {
      let obj = {
        channelName: '',
        channelBudget: ''
      };
      obj.channelName = element;
      obj.channelBudget = this.calculatedBudget[element];
      data.push(obj);
    });
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Channel Level Budget Calculation',
      useBom: true,
      noDownload: false,
      headers: ['Channel', 'Budget Allocation($)']
    };
    new ngxCsv(data, 'Channel Level Budget', options);
  }
}
