import { Component, OnInit, ViewChild  , ElementRef} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('footer') footer: any;
  constructor() {}

  ngOnInit(): void {}
}
