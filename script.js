class MatrixEffect {
  constructor() {
    this.canvas = document.getElementById('matrix-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    this.fontSize = 16;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.random() * -100;
    }
    
    this.initialize();
  }
  
  initialize() {
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.columns = Math.floor(this.canvas.width / this.fontSize);
      this.drops = [];
      for (let i = 0; i < this.columns; i++) {
        this.drops[i] = Math.random() * -100;
      }
    });
    
    this.draw();
  }
  
  draw() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const purpleColors = [
      '#8a2be2',
      '#9370db',
      '#800080',
      '#9932cc',
      '#bf00ff'
    ];
    
    this.ctx.font = this.fontSize + 'px monospace';
    
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const colorIndex = Math.floor(Math.random() * purpleColors.length);
      this.ctx.fillStyle = purpleColors[colorIndex];
      
      if (this.drops[i] <= 1) {
        this.ctx.fillStyle = '#ffffff';
      }
      
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
      
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
    
    requestAnimationFrame(() => this.draw());
  }
}

function setupScrollAnimation() {
  const elements = document.querySelectorAll('.about-section, .social-links');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll', 'show');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
  });
}

function setupHoverEffects() {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const icon = link.querySelector('i');
      icon.style.transform = 'scale(1.2) rotate(5deg)';
      icon.style.transition = 'transform 0.3s ease';
    });
    
    link.addEventListener('mouseleave', () => {
      const icon = link.querySelector('i');
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const matrix = new MatrixEffect();
  setupScrollAnimation();
  setupHoverEffects();
});