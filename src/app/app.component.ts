import { Component } from '@angular/core';
import { MainService } from 'src/app/main/service/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Multi Touch Attribution Model';

  constructor(public mainService: MainService) {}

}
