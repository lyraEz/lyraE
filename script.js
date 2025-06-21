class ParticleBackground {
    constructor() {
        this.container = document.getElementById('particle-background');
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }
    init() {
        this.createParticles();
        this.animate();
    }
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            const colors = ['#8b5cf6', '#a855f7', '#ec4899', '#06b6d4'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: size
            });
        }
    }
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
            if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        requestAnimationFrame(() => this.animate());
    }
}
class MusicPlayer {
    constructor() {
        this.currentTrack = null;
        this.tracks = new Map();
        this.init();
    }
    init() {
        const musicCards = document.querySelectorAll('.music-card');
        musicCards.forEach(card => {
            const trackId = card.dataset.track;
            const audio = card.querySelector('.audio-element');
            const playButton = card.querySelector('.play-button');
            const visualizer = card.querySelector('.audio-visualizer');
            this.tracks.set(trackId, {
                card,
                audio,
                playButton,
                visualizer,
                isPlaying: false
            });
            playButton.addEventListener('click', () => this.togglePlay(trackId));
            audio.addEventListener('ended', () => this.onTrackEnd(trackId));
            audio.addEventListener('timeupdate', () => this.updateVisualizer(trackId));
            audio.addEventListener('loadstart', () => console.log(`Loading ${trackId}`));
            audio.addEventListener('canplay', () => console.log(`Can play ${trackId}`));
        });
    }
    togglePlay(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) return;
        this.tracks.forEach((otherTrack, otherTrackId) => {
            if (otherTrackId !== trackId && otherTrack.isPlaying) {
                this.stopTrack(otherTrackId);
            }
        });
        if (track.isPlaying) {
            this.pauseTrack(trackId);
        } else {
            this.playTrack(trackId);
        }
    }
    playTrack(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) return;
        track.audio.play().then(() => {
            track.isPlaying = true;
            track.card.classList.add('playing');
            this.currentTrack = trackId;
        }).catch(error => {
            this.showError(`Não foi possível reproduzir a música. Verifique se o arquivo existe.`);
        });
    }
    pauseTrack(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) return;
        track.audio.pause();
        track.isPlaying = false;
        track.card.classList.remove('playing');
        if (this.currentTrack === trackId) {
            this.currentTrack = null;
        }
    }
    stopTrack(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) return;
        track.audio.pause();
        track.audio.currentTime = 0;
        track.isPlaying = false;
        track.card.classList.remove('playing');
        if (this.currentTrack === trackId) {
            this.currentTrack = null;
        }
    }
    onTrackEnd(trackId) {
        const track = this.tracks.get(trackId);
        if (!track) return;
        track.isPlaying = false;
        track.card.classList.remove('playing');
        this.currentTrack = null;
    }
    updateVisualizer(trackId) {
        const track = this.tracks.get(trackId);
        if (!track || !track.isPlaying) return;
        const progress = track.audio.currentTime / track.audio.duration;
        track.visualizer.style.transform = `scaleX(${progress})`;
    }
    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}
class AnimationController {
    constructor() {
        this.init();
    }
    init() {
        this.animateOnScroll();
        this.addHoverEffects();
    }
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);
        const animatedElements = document.querySelectorAll('[class*="fade"], [class*="slide"]');
        animatedElements.forEach(el => observer.observe(el));
    }
    addHoverEffects() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.addRippleEffect(link);
            });
        });
        const musicCards = document.querySelectorAll('.music-card');
        musicCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.enhanceWaveAnimation(card);
            });
            card.addEventListener('mouseleave', () => {
                this.resetWaveAnimation(card);
            });
        });
    }
    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.3);
            width: 0;
            height: 0;
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        element.style.position = 'relative';
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    enhanceWaveAnimation(card) {
        const wavePaths = card.querySelectorAll('.wave-path');
        wavePaths.forEach(path => {
            path.style.animationDuration = '2s';
        });
    }
    resetWaveAnimation(card) {
        const wavePaths = card.querySelectorAll('.wave-path');
        wavePaths.forEach((path, index) => {
            const originalDuration = index % 2 === 0 ? '6s' : '8s';
            path.style.animationDuration = originalDuration;
        });
    }
}
class ProfileImageEffects {
    constructor() {
        this.profileWrapper = document.querySelector('.profile-image-wrapper');
        this.init();
    }
    init() {
        if (!this.profileWrapper) return;
        this.profileWrapper.addEventListener('mouseenter', () => {
            this.showParticles();
        });
        this.profileWrapper.addEventListener('mouseleave', () => {
            this.hideParticles();
        });
    }
    showParticles() {
        const particles = this.profileWrapper.querySelectorAll('.floating-particles .particle');
        particles.forEach((particle, index) => {
            particle.style.opacity = '1';
            particle.style.animation = `floatParticle ${4 + index * 0.5}s infinite ease-in-out`;
        });
    }
    hideParticles() {
        const particles = this.profileWrapper.querySelectorAll('.floating-particles .particle');
        particles.forEach(particle => {
            particle.style.opacity = '0.2';
        });
    }
}
class ResponsiveHandler {
    constructor() {
        this.init();
    }
    init() {
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        this.handleResize(); 
    }
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        const contentWrapper = document.querySelector('.content-wrapper');
        if (isMobile) {
            contentWrapper.style.gridTemplateColumns = '1fr';
            contentWrapper.style.maxWidth = '400px';
        } else {
            contentWrapper.style.gridTemplateColumns = '1fr 1fr';
            contentWrapper.style.maxWidth = '1200px';
        }
    }
}
const additionalStyles = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
    new MusicPlayer();
    new AnimationController();
    new ProfileImageEffects();
    new ResponsiveHandler();
});
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
}
window.addEventListener('error', (e) => {
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.querySelectorAll('audio').forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.dataset.wasPlaying = 'true';
            }
        });
    } else {
        document.querySelectorAll('audio[data-was-playing="true"]').forEach(audio => {
            audio.play();
            delete audio.dataset.wasPlaying;
        });
    }
});