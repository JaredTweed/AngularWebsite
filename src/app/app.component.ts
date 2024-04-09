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
  touchActive = false;

  timeFpsDropped = 0;
  timeFpsGood = 0;
  stopBlobSpinning = false;

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

  isMobileDevice(): boolean {
    return /Mobi/i.test(window.navigator.userAgent);
  }

  @HostListener('document:mousemove', ['$event'])
  updateMousePosition(event: MouseEvent): void {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
    this.touchActive = false;
  }

  @HostListener('document:touchmove', ['$event'])
  updateTouchPosition(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchX = touch.pageX;
    this.touchY = touch.pageY;
    this.touchActive = true;
  }

  private requestId: number | undefined;
  private lastFrameTime: number = 0;
  private readonly frameRateLimit: number = 1000 / 60; // 60 fps

  private speed = 0.00005; // Base speed
  private acceleration = 0.00005; // Acceleration factor
  private maxSpeed = 0.03; // Maximum speed

  ngOnInit(): void {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'dark');
    }


    const animate = (currentTime: number) => {
      if (!this.lastFrameTime) {
        this.lastFrameTime = currentTime;
      }
      const delta = currentTime - this.lastFrameTime;

      // Check if FPS is dropping or is good
      if (delta !== 0) {
        if (1000 / delta <= 20) {
          this.timeFpsDropped += delta / 1000;
          console.log('FPS dropped for', this.timeFpsDropped, 'seconds. FPS is ', 1000 / delta, 'frames per second');
        }
        if (1000 / delta > 20) {
          this.timeFpsGood += delta / 1000;
          if (this.timeFpsGood > 3) { this.timeFpsDropped = 0; }
          console.log('FPS has been good for', this.timeFpsGood, 'seconds. FPS is ', 1000 / delta, 'frames per second');
        }
      }

      // Update blob position irrespective of the FPS
      if (delta > this.frameRateLimit) {
        const targetX = this.touchActive ? this.touchX : this.mouseX;
        const targetY = this.touchActive ? this.touchY : this.mouseY;
        const dx = targetX - this.blobX;
        const dy = targetY - this.blobY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Update speed based on distance to target, mimicking acceleration
        const currentSpeed = Math.min(this.speed + this.acceleration * distance, this.maxSpeed);

        if (distance > 1) { // Check if blob is not already at the target to avoid jittering
          setTimeout(() => {
            this.blobX += dx * currentSpeed;
            this.blobY += dy * currentSpeed;
          }, 80);
        }

        this.lastFrameTime = currentTime - (delta % this.frameRateLimit);
      }

      // Continue updating/animating the blob position if the FPS is good
      if (this.timeFpsDropped < 3) {
        this.stopBlobSpinning = true;
        this.requestId = requestAnimationFrame(animate);
      }
    };

    animate(0);



  }

  ngOnDestroy(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }
}
