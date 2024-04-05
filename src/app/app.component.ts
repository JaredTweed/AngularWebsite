import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nct';

  blobX = 0;
  blobY = 0;

  mouseX = 0;
  mouseY = 0;
  touchX = 0;
  touchY = 0;

  @HostListener('document:mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
  }

  @HostListener('document:touchmove', ['$event'])
  updateTouchPosition(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchX = touch.pageX;
    this.touchY = touch.pageY;
  }

  updatePosition(): void {
    const speed = 0.01;
    const targetX = this.mouseX || this.touchX;
    const targetY = this.mouseY || this.touchY;

    setTimeout(() => {
      this.blobX += (targetX - this.blobX) * speed;
      this.blobY += (targetY - this.blobY) * speed;
    }, 200);
  }



  ngOnInit(): void {
    setInterval(() => {

      if (this.blobX !== this.mouseX && this.blobY != this.mouseY) {
        this.updatePosition();
      }
    }, 1);
  }
}
