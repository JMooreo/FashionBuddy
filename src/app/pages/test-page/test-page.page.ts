import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.page.html',
  styleUrls: ['./test-page.page.scss'],
})
export class TestPagePage implements OnInit {

  counter=0

  constructor() { }

  ngOnInit() {
  }

  increment(){
    this.counter++
  }

}
