function controlreversedRange(reversedRange, positiveRange) {
  const [from, to] = getParsed(reversedRange, positiveRange);
  fillSlider(reversedRange, positiveRange, '#C6C6C6', '#25daa5', positiveRange);
  if (from > to) {
    reversedRange.value = to;
  } else {
    reversedRange.value = from;
  }
}

function controlpositiveRange(reversedRange, positiveRange) {
  const [from, to] = getParsed(reversedRange, positiveRange);
  fillSlider(reversedRange, positiveRange, '#C6C6C6', '#25daa5', positiveRange);
  setToggleAccessible(positiveRange);
  if (from <= to) {
    positiveRange.value = to;
  } else {
    positiveRange.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const positiveRange = document.querySelector('#positiveRange');
  if (Number(currentTarget.value) <= 0 ) {
    positiveRange.style.zIndex = 2;
  } else {
    positiveRange.style.zIndex = 0;
  }
}

const reversedRange = document.querySelector('#reversedRange');
const positiveRange = document.querySelector('#positiveRange');

fillSlider(reversedRange, positiveRange, '#C6C6C6', '#25daa5', positiveRange);
setToggleAccessible(positiveRange);

reversedRange.oninput = () => controlreversedRange(reversedRange, positiveRange);
positiveRange.oninput = () => controlpositiveRange(reversedRange, positiveRange);
