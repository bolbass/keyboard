import './style.css';
import { keyName } from './layouts/keyName';
import { ENG, ENG_CAPS_LOCK_ON, ENG_SHIFT_ON } from './layouts/ENG';
import { RUS, RUS_CAPS_LOCK_ON, RUS_SHIFT_ON } from './layouts/RUS';
import { keyProp } from './keyboardProperties';
import { scale } from './layouts/scale';

class Counter {
  constructor(start = 0) {
    this.count = start;
  }

  increment() {
    this.count += 1;
  }

  getCount() {
    return this.count;
  }
}
const counter = new Counter(0);
function generateKeyboard() {
  const bod = document.querySelector('body');
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  bod.appendChild(wrapper);

  const text0 = document.createElement('p');
  text0.innerText = 'Задание: Виртуальная клавиатура';
  wrapper.appendChild(text0);

  const text1 = document.createElement('p');
  text1.innerText = 'Переключение языка: левый ctrl+ левый shift';
  wrapper.appendChild(text1);

  const textInput = document.createElement('textarea');
  wrapper.appendChild(textInput);

  const keyboardBlock = document.createElement('div');
  keyboardBlock.classList.add('keyboard');
  wrapper.appendChild(keyboardBlock);

  for (let i = 0; i < keyName.length; i += 1) {
    const button = (`
      <div class="key ${scale[i]}" data-code="${keyName[i]}">
        <span class="eng ${keyProp.language === 'ENG' ? '' : 'hidden'}">
          <span class="letter base">${ENG[i]}</span>
          <span class="letter caps-on hidden">${ENG_CAPS_LOCK_ON[i]}</span>
          <span class="letter shift-on hidden">${ENG_SHIFT_ON[i]}</span>
        </span>
        <span class="rus ${keyProp.language === 'ENG' ? 'hidden' : ''}">
          <span class="letter base">${RUS[i]}</span>
          <span class="letter caps-on hidden">${RUS_CAPS_LOCK_ON[i]}</span>
          <span class="letter shift-on hidden">${RUS_SHIFT_ON[i]}</span>
          </span>
      </div>`);
    keyboardBlock.insertAdjacentHTML('beforeend', button);
  }
}

function addAnimation(element) {
  element.classList.add('animation_start');
}

function delAnimation(element) {
  element.classList.remove('animation_start');
  element.classList.add('animation_end');
  element.addEventListener('animation_end', () => {
    element.classList.remove('animation_end');
  });
}

function langSwitch() {
  const LANGUAGE = keyProp.language;
  const KEYS = document.querySelectorAll('.key');
  if (LANGUAGE === 'ENG') {
    KEYS.forEach((key) => {
      key.querySelector('.eng').classList.add('hidden');
      key.querySelector('.rus').classList.remove('hidden');
    });
    keyProp.language = 'RUS';
    localStorage.setItem('cur_language', keyProp.language);
  } else {
    KEYS.forEach((key) => {
      key.querySelector('.rus').classList.add('hidden');
      key.querySelector('.eng').classList.remove('hidden');
    });
    keyProp.language = 'ENG';
    localStorage.setItem('cur_language', keyProp.language);
  }
}

function changeClass(whoVisible) {
  const ALL_LETTER = document.querySelectorAll('.letter');
  const FILTER_WITHOUT_HIDDEN = Array.from(ALL_LETTER).filter((letter) => !letter.classList.contains('hidden'));
  FILTER_WITHOUT_HIDDEN.forEach((letter) => {
    letter.classList.add('hidden');
  });
  const SHOULD_BE_VISIBLE_COLLECTION = document.querySelectorAll(whoVisible);
  SHOULD_BE_VISIBLE_COLLECTION.forEach((letter) => {
    letter.classList.remove('hidden');
  });
}

function cursorUpdate() {
  const textInput = document.querySelector('textarea');
  textInput.selectionStart = keyProp.cursorPosition;
  textInput.selectionEnd = keyProp.cursorPosition;
}

function findLetter() {
  const textInput = document.querySelector('textarea');
  const split = (textInput.value).split('\n').map((line) => {
    if (line.length > 79) {
      let { length } = line;
      const countStr = [];
      while (length > 79) {
        countStr.push(79);
        length -= 79;
      }
      if (length > 0) {
        countStr.push(length);
      }
      return countStr;
    }
    return line.length;
  });
  const result = split.flat();
  keyProp.letterInString = result;
}

function getIndex() {
  let countIndex = 0;
  let countS = keyProp.cursorPosition;
  if (keyProp.letterInString.length === 1) {
    keyProp.currentPositionInString = countS;
  } else {
    for (let i = 0; i < keyProp.letterInString.length; i += 1) {
      if (countS <= keyProp.letterInString[i]) {
        keyProp.indexInString = countIndex;
        break;
      }
      countS -= keyProp.letterInString[i];
      countIndex += 1;
      countS -= 1;
    }
    keyProp.currentPositionInString = countS;
  }
}

function pushKeys(dataCode) {
  const textInput = document.querySelector('textarea');
  if (keyName.includes(dataCode)) {
    textInput.blur();
    textInput.focus();
    cursorUpdate();
    switch (dataCode) {
      case 'Backspace':
        if (keyProp.cursorPosition > 0) {
          textInput.value = (textInput.value).split('').filter((char, index) => index !== keyProp.cursorPosition - 1).join('');
          keyProp.cursorPosition -= 1;
          cursorUpdate();
        }
        break;
      case 'Delete': {
        textInput.value = (textInput.value).split('').filter((char, index) => index !== keyProp.cursorPosition).join('');
        cursorUpdate();
        break;
      }
      case 'Tab':
        textInput.value = `${textInput.value.slice(0, keyProp.cursorPosition)}    ${textInput.value.slice(keyProp.cursorPosition)}`;
        keyProp.cursorPosition += 4;
        cursorUpdate();
        break;
      case 'Enter':
        textInput.value = `${textInput.value.slice(0, keyProp.cursorPosition)}\n${textInput.value.slice(keyProp.cursorPosition)}`;
        keyProp.cursorPosition += 1;
        cursorUpdate();
        break;
      case 'Space':
        textInput.value = `${textInput.value.slice(0, keyProp.cursorPosition)} ${textInput.value.slice(keyProp.cursorPosition)}`;
        keyProp.cursorPosition += 1;
        cursorUpdate();
        break;
      case 'ArrowLeft':
        if (keyProp.cursorPosition > 0) {
          keyProp.cursorPosition -= 1;
          cursorUpdate();
        }
        break;
      case 'ArrowRight':
        if (keyProp.cursorPosition < textInput.value.length) {
          keyProp.cursorPosition += 1;
          cursorUpdate();
        }
        break;
      case 'ArrowUp':
        findLetter();
        getIndex();
        if (keyProp.letterInString[keyProp.indexInString - 1] !== undefined) {
          const countLetterLeft = keyProp.currentPositionInString;
          const needRight = keyProp.letterInString[keyProp.indexInString - 1]
            - countLetterLeft + 1;
          if (keyProp.letterInString[keyProp.indexInString - 1] >= countLetterLeft) {
            keyProp.cursorPosition -= (needRight + countLetterLeft);
            cursorUpdate();
          } else {
            keyProp.cursorPosition -= countLetterLeft + 1;
            cursorUpdate();
          }
        } else {
          keyProp.cursorPosition = 0;
          cursorUpdate();
        }
        break;
      case 'ArrowDown':
        findLetter();
        getIndex();
        if (keyProp.letterInString[keyProp.indexInString + 1] !== undefined) {
          const countLetterRight = keyProp.letterInString[keyProp.indexInString]
            - keyProp.currentPositionInString;
          const needLeft = keyProp.letterInString[keyProp.indexInString]
            - countLetterRight + 1;
          if (keyProp.letterInString[keyProp.indexInString + 1] >= needLeft) {
            keyProp.cursorPosition += needLeft + countLetterRight;
            cursorUpdate();
          } else {
            keyProp.cursorPosition += keyProp.letterInString[keyProp.indexInString
                + 1] + countLetterRight + 1;
            cursorUpdate();
          }
        } else {
          keyProp.cursorPosition = textInput.value.length;
          cursorUpdate();
        }
        break;
      case 'ShiftLeft':
        break;
      case 'ShiftRight':
        break;
      case 'ControlRight':
        break;
      case 'ControlLeft':
        break;
      case 'MetaLeft':
        break;
      case 'AltLeft':
        break;
      case 'AltRight':
        break;
      case 'CapsLock':
        break;
      default:
        textInput.value = `${textInput.value.slice(0, keyProp.cursorPosition)}${document.querySelector(`[data-code="${dataCode}"]`).innerText}${textInput.value.slice(keyProp.cursorPosition)}`;
        keyProp.cursorPosition += 1;
        textInput.selectionStart = keyProp.cursorPosition;
        textInput.selectionEnd = keyProp.cursorPosition;
        if (textInput.value.length % 78 === 0) {
          textInput.value = `${textInput.value.slice(0, keyProp.cursorPosition)}\n${textInput.value.slice(keyProp.cursorPosition)}`;
          keyProp.cursorPosition += 1;
          textInput.selectionStart = keyProp.cursorPosition;
          textInput.selectionEnd = keyProp.cursorPosition;
        }
    }
    findLetter();
    getIndex();
    counter.increment();
  }
}

function onKeyDown(event) {
  event.preventDefault();
  const { repeat } = event;
  if (event.code === 'ShiftLeft' && (event.ctrlKey === true || event.metaKey === true)) {
    langSwitch();
  }
  if (event.code === 'CapsLock') {
    if (!repeat) {
      if (keyProp.capsLock === false) {
        changeClass('.caps-on');
        addAnimation(document.querySelector('[data-code="CapsLock"]'));
        keyProp.capsLock = true;
      } else {
        changeClass('.base');
        delAnimation(document.querySelector('[data-code="CapsLock"]'));
        keyProp.capsLock = false;
      }
    }
  }
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (!repeat) {
      if (keyProp.capsLock === false) {
        changeClass('.shift-on');
        keyProp.shift = true;
      } else {
        changeClass('.caps-on-shift-on');
        keyProp.shift = true;
      }
    }
  }
  if (event.code !== 'CapsLock' && keyName.includes(event.code)) {
    pushKeys(event.code);
    if (!repeat) {
      addAnimation(document.querySelector(`[data-code="${event.code}"]`));
    }
  }
}

function onKeyUp(event) {
  event.preventDefault();
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (keyProp.capsLock === false) {
      changeClass('.base');
      keyProp.shift = false;
    } else {
      changeClass('.caps-on');
      keyProp.shift = false;
    }
  }
  if (event.code !== 'CapsLock' && keyName.includes(event.code)) {
    delAnimation(document.querySelector(`[data-code="${event.code}"]`));
  }
}

function onMouseDown(event) {
  if (event.target.closest('.key')) {
    const dataCode = event.target.closest('.key').dataset.code;
    pushKeys(dataCode);
    if (dataCode === 'CapsLock') {
      if (keyProp.capsLock === false) {
        changeClass('.caps-on');
        addAnimation(event.target.closest('.key'));
        keyProp.capsLock = true;
      } else {
        changeClass('.base');
        delAnimation(event.target.closest('.key'));
        keyProp.capsLock = false;
      }
    } else if (dataCode === 'ShiftLeft' || dataCode === 'ShiftRight') {
      if (document.querySelector('[data-code="ShiftLeft"]').classList.contains('animation_start')) {
        delAnimation(document.querySelector('[data-code="ShiftLeft"]'));
      }
      if (document.querySelector('[data-code="ShiftRight"]').classList.contains('animation_start')) {
        delAnimation(document.querySelector('[data-code="ShiftRight"]'));
      }
      addAnimation(event.target.closest('.key'));
      if (keyProp.capsLock === false) {
        changeClass('.shift-on');
        keyProp.shift = true;
      } else {
        changeClass('.caps-on-shift-on');
        keyProp.shift = true;
      }
    } else {
      keyProp.selectMouse = event.target.closest('.key');
      addAnimation(event.target.closest('.key'));
    }
  }
}

function onMouseUp(event) {
  if (event.target.closest('.key')) {
    if (event.target.closest('.key').dataset.code === 'ShiftLeft' || event.target.closest('.key').dataset.code === 'ShiftRight') {
      delAnimation(event.target.closest('.key'));
      if (keyProp.capsLock === false) {
        changeClass('.base');
        keyProp.shift = false;
      } else {
        changeClass('.caps-on');
        keyProp.shift = false;
      }
    }
  }
  if (keyProp.selectMouse) {
    if (keyProp.selectMouse.dataset.code === 'ShiftLeft' || keyProp.selectMouse.dataset.code === 'ShiftRight') {
      if (keyProp.capsLock === false) {
        changeClass('.base');
        keyProp.shift = false;
      } else {
        changeClass('.caps-on');
        keyProp.shift = false;
      }
    }
    delAnimation(keyProp.selectMouse);
    keyProp.selectMouse = null;
  }
}

function onClick(event) {
  if (event.target.closest('.key')) {
    document.querySelector('textarea').focus();
  }
}

document.addEventListener('keydown', (event) => onKeyDown(event));
document.addEventListener('keyup', (event) => onKeyUp(event));
document.addEventListener('mousedown', (event) => onMouseDown(event));
document.addEventListener('mouseup', (event) => onMouseUp(event));
document.addEventListener('mouseup', (event) => onClick(event));

window.onload = () => {
  generateKeyboard();
  document.querySelector('textarea').addEventListener('click', (event) => {
    keyProp.cursorPosition = event.target.selectionStart;
  });
};
