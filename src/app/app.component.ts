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

      this.requestId = requestAnimationFrame(animate);
    };

    animate(0);
  }

  ngOnDestroy(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }
}
