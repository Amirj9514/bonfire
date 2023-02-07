import { Component, OnInit } from '@angular/core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-past-order',
  templateUrl: './past-order.component.html',
  styleUrls: ['./past-order.component.scss'],
  styles: [
    `
      .card.disabled {
        opacity: 0.5;
      }
      .custom-header::after {
        content: none;
      }
    `,
  ],
})
export class PastOrderComponent implements OnInit {
  downIcon = faChevronDown;
  disabled = false;
  constructor(config: NgbAccordionConfig) {
    config.closeOthers = true;
    config.type = 'info';
  }

  ngOnInit(): void {}
}
