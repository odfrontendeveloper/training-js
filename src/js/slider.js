function createSlider(mainBlock, rowBlock, previousButton, nextButton){
  function pixelsToNum(px){
    return Number(px.substring(0, px.length - 2));
  }
  let getElementsListLength = (elementsList) => {
    let counter = 0;
    let widthElement;

    for (var key in elementsList) {
      if(elementsList[key] == '[object HTMLImageElement]' || elementsList[key] == '[object HTMLDivElement]'){
        counter++;
        if(widthElement == undefined){
          widthElement = pixelsToNum(getComputedStyle(elementsList[key]).width);
        }
      }
    }

    let slidesInWindow = pixelsToNum(getComputedStyle(document.querySelector(mainBlock)).width) / widthElement;
    return {
      'counter': counter,
      'width': widthElement,
      'slidesInWindow': slidesInWindow
    };
  }

  let blockButtonForOneSec = () => {
    document.querySelector(nextButton).disabled = true;
    document.querySelector(previousButton).disabled = true;

    let interval = setTimeout(function(){
      document.querySelector(nextButton).disabled = false;
      document.querySelector(previousButton).disabled = false;

      clearInterval(interval);
    }, 1050);
  }

  let previousSlide = (blockWidth, elcounter, slidesShowBase) => {
    blockButtonForOneSec();

    let maxLeft = (elcounter - slidesShowBase) * blockWidth;
    let row = document.querySelector(rowBlock);

    if(getComputedStyle(row).left != '0px'){
      let newLeft = pixelsToNum(getComputedStyle(row).left) + blockWidth;
      row.style.left = newLeft + 'px';
    }
    else {
      row.style.left = -maxLeft + 'px';
    }
  }

  let nextSlide = (blockWidth, elcounter, slidesShowBase) => {
    if(elcounter != slidesShowBase){
      blockButtonForOneSec();

      let row = document.querySelector(rowBlock);
      let maxLeft = (elcounter - slidesShowBase) * blockWidth;

      if(getComputedStyle(row).left != '-' + maxLeft + 'px'){
        let newLeft = pixelsToNum(getComputedStyle(row).left) - blockWidth;
        row.style.left = newLeft + 'px';
      }
      else {
        row.style.left = '0px';
      }
    }
  }

  let needControlButtons = (elementOptions) => {
    let buttonControl = document.querySelector('.control-projects-block');
    if(elementOptions.counter > elementOptions.slidesInWindow){
      buttonControl.style.display = 'flex';
    }
    else {
      buttonControl.style.display = 'none';
    }
  }

  let makeSlider = () => {
    let elementOptions = getElementsListLength(document.querySelector(rowBlock).childNodes);
    let widthElements = elementOptions.width;
    let previous = document.querySelector(previousButton);
    let next = document.querySelector(nextButton);
    needControlButtons(elementOptions);

    window.onresize = function(event) {
      elementOptions = getElementsListLength(document.querySelector(rowBlock).childNodes);
      widthElements = elementOptions.width;
      let maxLeft = (elementOptions.counter - elementOptions.slidesInWindow) * widthElements;
      if(-maxLeft > pixelsToNum(getComputedStyle(document.querySelector(rowBlock)).left)){
        document.querySelector(rowBlock).style.left = -maxLeft + 'px';
      }
      needControlButtons(elementOptions);
    };

    previous.addEventListener('click', function(){
      previousSlide(widthElements, elementOptions.counter, elementOptions.slidesInWindow);
    });

    next.addEventListener('click', function(){
      nextSlide(widthElements, elementOptions.counter, elementOptions.slidesInWindow);
    });
  }

  return {'start': makeSlider};
}

let newslider = createSlider('.projects-control', '.projects-slider-list', '#previousSlide', '#nextSlide');
newslider.start();
