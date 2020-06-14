import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormGroupDirective } from '@angular/forms';
import * as _ from 'lodash';
import { MainService } from 'src/app/main/service/main.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PreferredChannelListComponent } from 'src/app/preferred-channel-list/preferred-channel-list.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: NgForm | FormGroupDirective | null) {
    return control && control.invalid && control.touched;
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  trainForm: FormGroup;
  marketingChannelsForm: FormGroup;
  fileName: string;
  showTrainProgress = false;
  channelExpansion = true;
  budgetCalcArr = {};
  objectKeys = Object.keys;
  marketingChannels = [
    { controlName: 'affiliate', displayName: 'Affiliate' },
    { controlName: 'directMail', displayName: 'Direct Mail' },
    { controlName: 'paidSocial', displayName: 'Paid Social' },
    { controlName: 'display', displayName: 'Display' },
    { controlName: 'videos', displayName: 'Videos' },
    { controlName: 'pushNotification', displayName: 'Push Notification' },
    { controlName: 'paidSearch', displayName: 'Paid Search' },
    { controlName: 'tv', displayName: 'TV' },
    { controlName: 'email', displayName: 'Email' },
    { controlName: 'internalCampaign', displayName: 'Internal Campaign' },
    { controlName: 'sms', displayName: 'SMS' },
    { controlName: 'audio', displayName: 'Audio' }];

  resetValue = {
    totalBudget: '', affiliate: '', directMail: '',
    paidSocial: '', display: '', videos: '', pushNotification: '',
    paidSearch: '', tv: '', email: '', internalCampaign: '', sms: '', audio: ''
  };
  modelDropDown = [
    { value: 'firstTouch', viewValue: 'First Touch' },
    { value: 'lastTouch', viewValue: 'Last Touch' },
    { value: 'linear', viewValue: 'Linear' },
    { value: 'markovChain', viewValue: 'Markov Chain' },
    { value: 'customizedModel', viewValue: 'Customized Model' },
    { value: 'all', viewValue: 'All' },
  ];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private mainService: MainService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.trainForm = new FormGroup({
      xls: new FormControl(null, { validators: [Validators.required] })
    });
    this.marketingChannelsForm = new FormGroup({
      totalBudget: new FormControl('', { validators: [Validators.required] }),
      model: new FormControl('', { validators: [Validators.required] })
    });
    this.marketingChannels.forEach(item => {
      this.marketingChannelsForm.addControl(item.controlName, new FormControl(''));
    });
    this.openSnackBar();
  }

  onXlsPicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name;
    this.trainForm.patchValue({ xls: file });
    this.trainForm.get('xls').updateValueAndValidity(); // This informs ng that I changed value. Store and revalidate the changed value
    const reader = new FileReader(); // converting the picked image to a data url to be used in src of img.
    // reader.onload = () => {
    //   this.imagePreview = reader.result;
    // };
    reader.readAsDataURL(file);
  }

  train = () => {
    this.showTrainProgress = true;
    this.mainService.trainDataSet(this.trainForm.value.xls).subscribe(res => {
      this.showTrainProgress = false;
      this.fileName = '';
      this.trainForm.reset();
    });
  }

  formSubmit = () => {
    this.mainService.isLoading = true;
    this.mainService.marketingChannelSubmit(this.marketingChannelsForm.getRawValue()).subscribe(res => {
      this.mainService.isLoading = false;
      this.marketingChannelsForm.reset(this.resetValue);
      this.channelExpansion = false;
      this.marketingChannelsForm.markAsPristine();
      this.marketingChannelsForm.markAsUntouched();
      this.budgetCalcArr = [];
      this.marketingChannels.forEach(item => {
        if (Object.keys(res).indexOf(item.controlName) !== -1) {
          const val = {};
          val[item.displayName] = res[item.controlName];
          // val[item.displayName] = item.displayName
          this.budgetCalcArr = { ...val, ...this.budgetCalcArr };
        }
      });
      this.openListDialog();
    }, () => {
      this.mainService.isLoading = false;
    });
  }

  setExpansion = (val: boolean) => {
    this.channelExpansion = val;
  }

  openListDialog = () => {
    let dialogRef = this.dialog.open(PreferredChannelListComponent, {
      width: '40vw',
      data: this.budgetCalcArr
    });
    dialogRef.afterClosed().subscribe(res => {
      this.channelExpansion = true;
    });
  }

  openSnackBar = () => {
    this._snackBar.open('This is an incremental POC. Let us help you to know the POC', 'More Details', {
      duration: 10000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
