const body = document.querySelector('body');
const header = document.querySelector('.header'); 
const navigation = document.querySelector('.header__nav');
const hamburger = document.querySelector('.hamburger');

document.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 1) {
    header.classList.add('header_has-bg');
  } else {
    header.classList.remove('header_has-bg');
  }
});

// work with hamburger 

header.addEventListener('click', (event) => {
  const target = event.target;
  console.log('target: ', target);
  const targetClassList = target.classList;
  
  switch (true) {
      case (targetClassList.contains('hamburger') && !targetClassList.contains('toggle') 
      || targetClassList.contains('hamburger__line')): 
          getNavigationMenu();
      break;
      case targetClassList.contains('toggle') || targetClassList.contains('header__menu-item > a'):
          removeNavigationMenu();
      break;
      case targetClassList.contains('navigation__link'): 
          removeNavigationMenu();
      break;
      default:
      break;
  }

});

function getNavigationMenu() {
  navigation.classList.add('header__nav_active');
  hamburger.classList.toggle('toggle');
  body.classList.add('scroll-hidden');
}

function removeNavigationMenu() {
  navigation.classList.remove('header__nav_active');
  hamburger.classList.remove('toggle');
  body.classList.remove('scroll-hidden');
}

