// work with hamburger 
const body = document.querySelector('body');
const header = document.querySelector('.header'); 
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.header__inner');

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
  navigation.classList.add('header__inner_active');
  hamburger.classList.toggle('toggle');
  body.classList.add('scroll-hidden');
}

function removeNavigationMenu() {
  navigation.classList.remove('header__inner_active');
  hamburger.classList.remove('toggle');
  body.classList.remove('scroll-hidden');
}

