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

  getBrowserName(): string {
    console.log('User Agent:', window.navigator.userAgent);
    const userAgent = window.navigator.userAgent;
    let browserName = '';

    if (userAgent.includes('Chrome')) {
      browserName = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
    } else if (userAgent.includes('Safari')) {
      browserName = 'Safari';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      browserName = 'Opera';
    } else if (userAgent.includes('Edge')) {
      browserName = 'Edge';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      browserName = 'Internet Explorer';
    } else {
      browserName = 'Unknown';
    }

    console.log('Browser:', browserName);

    return browserName;
  }

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

  ngOnInit(): void {
    // if (this.getBrowserName() === 'Edge' || this.getBrowserName() === 'Firefox') {
    setInterval(() => {

      if (this.blobX !== this.mouseX && this.blobY != this.mouseY) {
        const speed = 0.01;
        const targetX = this.mouseX || this.touchX;
        const targetY = this.mouseY || this.touchY;

        setTimeout(() => {
          this.blobX += (targetX - this.blobX) * speed;
          this.blobY += (targetY - this.blobY) * speed;
        }, 100);
      }
    }, 1);
    // }
  }



  // private requestId: number | undefined;
  // private lastFrameTime: number = 0;
  // private readonly frameRateLimit: number = 1000 / 60; // 60 fps

  // ngOnInit(): void {
  //   const animate = (currentTime: number) => {
  //     if (!this.lastFrameTime) {
  //       this.lastFrameTime = currentTime;
  //     }

  //     const delta = currentTime - this.lastFrameTime;

  //     if (delta > this.frameRateLimit) {
  //       if (this.blobX !== this.mouseX || this.blobY !== this.mouseY) {
  //         const speed = 0.022;
  //         const targetX = this.mouseX || this.touchX;
  //         const targetY = this.mouseY || this.touchY;

  //         this.blobX += (targetX - this.blobX) * speed;
  //         this.blobY += (targetY - this.blobY) * speed;
  //       }
  //       this.lastFrameTime = currentTime - (delta % this.frameRateLimit);
  //     }

  //     this.requestId = requestAnimationFrame(animate);
  //   };

  //   animate(0);
  // }

  // ngOnDestroy(): void {
  //   if (this.requestId) {
  //     cancelAnimationFrame(this.requestId);
  //   }
  // }
}
