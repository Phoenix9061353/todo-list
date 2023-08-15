const btnAdd = document.querySelector('button.add');
const btnSort = document.querySelector('button.sort');
const divAlert = document.querySelector('.alert');
const outputArea = document.querySelector('div.output');
let inputThing = document.getElementById('name');
let inputMonth = document.getElementById('month');
let inputDate = document.getElementById('date');

///////////////////////////////////////////////////////////
//提取表單內容用
let thing;
let month;
let date;

//存取記憶體用
let data;
let storageList = [];

///////////////////////////////////////////////////////////
//將表單內的之前的東西清掉
const init = function () {
  inputThing.value = '';
  inputMonth.value = '';
  inputDate.value = '';
};

//加上 List內容的 HTML element
const addTodoElement = function (thing, month, date, check = 0) {
  //todo list text
  let todo = document.createElement('div');
  todo.classList.add('todo');

  let todoThing = document.createElement('p');
  todoThing.innerText = thing;
  todoThing.classList.add('thing');

  let time = document.createElement('p');
  time.innerText = month + ' / ' + date;
  time.classList.add('time');

  //get Checked
  if (check === 1) {
    todoThing.classList.add('checked');
    time.classList.add('checked');
  }

  //todo list btn
  let checkBtn = document.createElement('button');
  checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  checkBtn.classList.add('check');
  checkBtn.addEventListener('click', (e) => {
    let clicked = e.target.closest('.check');
    let list = clicked.parentElement;
    let ps = list.querySelectorAll('p');
    ps.forEach((p) => p.classList.toggle('checked'));
    let text = list.children[0].innerText;
    let storageList2 = JSON.parse(localStorage.getItem('List'));
    for (let i = 0; i < storageList2.length; i++) {
      if (storageList2[i].thing === text) {
        storageList.splice(i, 1, {
          thing: storageList2[i].thing,
          month: storageList2[i].month,
          date: storageList2[i].date,
          check: storageList2[i].check
            ? storageList2[i].check === 0
              ? 1
              : 0
            : 1,
        });
        return localStorage.setItem('List', JSON.stringify(storageList));
      }
    }
  });

  let trashBtn = document.createElement('button');
  trashBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashBtn.classList.add('trash');
  trashBtn.addEventListener('click', (e) => {
    //讓btn被點擊選取的都是btn本身
    let clicked = e.target.closest('.trash');
    let list = clicked.parentElement;
    list.style.animation = 'scaleDown 0.3s forwards';

    list.addEventListener('animationend', () => {
      //Remove from localStorage
      let text = list.children[0].innerText;
      let storageList2 = JSON.parse(localStorage.getItem('List'));
      for (let i = 0; i < storageList2.length; i++) {
        if (storageList2[i].thing === text) {
          storageList.splice(i, 1);
          localStorage.setItem('List', JSON.stringify(storageList));
          return list.remove();
        }
      }
    });
  });

  //appendChild, animation
  todo.appendChild(todoThing);
  todo.appendChild(time);
  todo.appendChild(checkBtn);
  todo.appendChild(trashBtn);
  todo.style.animation = 'scaleUp 0.3s forwards';
  outputArea.appendChild(todo);
};

//取得之前存於記憶體裡的資料
const getStorage = function () {
  if (localStorage.getItem('List'))
    JSON.parse(localStorage.getItem('List')).forEach((d) =>
      storageList.push(d)
    );
  if (storageList.length > 0) {
    storageList.forEach((d) =>
      addTodoElement(d.thing, d.month, d.date, d.check)
    );
  }
};

//Merge sort
const mergeSort = function (arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  //當其中一方的arr被取完時停止
  while (i < arr1.length && j < arr2.length) {
    //先比月份
    if (arr1[i].month < arr2[j].month) {
      result.push(arr1[i]);
      i++;
    } else if (arr2[j].month < arr1[i].month) {
      result.push(arr2[j]);
      j++;
    }
    //月份相同時，比日期
    else if (arr1[i].month === arr2[j].month) {
      if (arr1[i].date < arr2[j].date) {
        result.push(arr1[i]);
        i++;
      } else if (arr2[j].date < arr1[i].date) {
        result.push(arr2[j]);
        j++;
      }
      //都一樣，兩個一起推
      else if (arr1[i].date === arr2[j].date) {
        result.push(arr1[i], arr2[j]);
        i++;
        j++;
      }
    }
  }

  //處理剩下一方的arr內容物
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }
  return result;
};

const mergeAlign = function (arr) {
  if (arr.length === 0 || arr === undefined) return [];
  if (arr.length === 1) return arr;
  else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeSort(mergeAlign(right), mergeAlign(left));
  }
};
///////////////////////////////////////////////////////////
//Page load完後的初始執行function
init();
getStorage();

///////////////////////////////////////////////////////////
//Load 完後的Event Listener
//Add List
btnAdd.addEventListener('click', () => {
  //重置alert div
  divAlert.classList.add('hidden');
  divAlert.innerHTML = '';

  //抓值
  thing = inputThing.value.trim();
  month = Number(inputMonth.value);
  date = Number(inputDate.value);

  //檢查輸入內容不為空白、數字部分為整數數字
  if (thing === '') {
    divAlert.classList.remove('hidden');
    return (divAlert.innerHTML = '請輸入要記錄的代辦事項！');
  }
  if (date === 0 || date > 31 || !Number.isInteger(date)) {
    divAlert.classList.remove('hidden');
    return (divAlert.innerHTML = '請輸入正確的日期！(1~31)');
  } else {
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        if (date > 30) {
          divAlert.classList.remove('hidden');
          return (divAlert.innerHTML = '請輸入屬於該月份的正確日期！');
        }
        break;
      case 2:
        if (date > 29) {
          divAlert.classList.remove('hidden');
          return (divAlert.innerHTML = '請輸入屬於該月份的正確日期！');
        }
        break;

      default:
        divAlert.classList.remove('hidden');
        return (divAlert.innerHTML = '請輸入正確的月份！( 1 ~ 12 )');
    }
  }
  data = { thing, month, date };
  storageList.push(data);
  localStorage.setItem('List', JSON.stringify(storageList));
  addTodoElement(thing, month, date);
  init();
});

//Sort by time
btnSort.addEventListener('click', () => {
  storageList = mergeAlign(storageList);

  outputArea.innerHTML = '';
  storageList.forEach((d) => {
    addTodoElement(d.thing, d.month, d.date, d.check ? d.check : 0);
  });
  localStorage.setItem('List', JSON.stringify(storageList));
});
