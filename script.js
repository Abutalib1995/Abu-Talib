// Typing effect
const typedSpan = document.getElementById('typed');
const skills = ['Video Editing', 'SEO', 'Digital Marketing', 'Google Ads', 'WordPress Development'];
let skillIndex = 0;
let charIndex = 0;
function type() {
  if (charIndex < skills[skillIndex].length) {
    typedSpan.textContent += skills[skillIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 150);
  } else {
    setTimeout(erase, 1500);
  }
}
function erase() {
  if (charIndex > 0) {
    typedSpan.textContent = skills[skillIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, 100);
  } else {
    skillIndex = (skillIndex + 1) % skills.length;
    setTimeout(type, 500);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  if(skills.length) setTimeout(type, 500);
});

// Counter animation
const counters = document.querySelectorAll('.number');
const speed = 200;
const animateCounters = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const inc = target / speed;
      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

// Intersection Observer for scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('show');
      if(entry.target.classList.contains('about')){
        animateCounters();
      }
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});
