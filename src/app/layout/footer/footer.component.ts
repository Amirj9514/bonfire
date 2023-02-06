import { Component, OnInit } from '@angular/core';
import { faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  googleIcon = faGooglePlay;
  appleIcon = faApple;
  constructor() {}

  ngOnInit(): void {}
}
