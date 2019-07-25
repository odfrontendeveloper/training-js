let dropdowmButton = document.querySelector('#dropdowm-button');
dropdowmButton.addEventListener('click', function(){
  let menu = document.querySelector('.menu');
  if(getComputedStyle(menu).display != 'none') {
    menu.style.display = 'none';
  }
  else {
    menu.style.display = 'flex';
  }
});
