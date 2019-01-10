function ready() {
  // Функция проверки наличия сохраненных данных в ЛС и возврате массива
  function loadArray() {
    return JSON.parse(localStorage.getItem('arrmain')) || [];
  }

  // Проверяем есть ли записи в массиве. Если нет, рисуем первую кнопку
  if (loadArray().length >= 1) {
    showArray(loadArray()); // Иначе отправляем на отрисовку весь массив
  } else {
    let rowMain = document.querySelector('#rowMain');
    let newCol = document.createElement('div');
    newCol.className += 'col';
    let butAdd = document.createElement('input');
    butAdd.className += 'form-control mt-1';
    butAdd.setAttribute('type', 'text');
    butAdd.setAttribute('placeholder', 'Add Task');
    butAdd.setAttribute('alt', '0');
    butAdd.setAttribute('autofocus', '');
    butAdd.addEventListener('keydown', addDown); // Навешиваем обработчик нажатия Enter
    newCol.appendChild(butAdd); // Вставляем Кнопку добавления в низ столбца
    rowMain.appendChild(newCol); // Вставляем столбец в строку
  }

  // Функция отрисовки массива
  function showArray(arrMain, teccol) {
    let rowMain = document.querySelector('#rowMain');
    rowMain.innerHTML = '';

    for (let i = 0, len = arrMain.length; i < len; i++) {
      let newCol = document.createElement('div');
      newCol.className += 'col';

      for (let j = 0, len = arrMain[i].length; j < len; j++) {
        let taskBlock = document.createElement('div');
        taskBlock.className += 'taskBlock';
        if (arrMain[i][j].import) taskBlock.className += ' bg-warning';
        if (arrMain[i][j].check) taskBlock.className += ' checked';
        taskBlock.setAttribute('onmousedown', 'return false');
        taskBlock.setAttribute('id', arrMain[i][j].id);
        taskBlock.setAttribute('alt', i);
        taskBlock.setAttribute('name', j);
        if (j !== 0) taskBlock.innerText = (i + 1) * 1 + '.' + j + ' ' + arrMain[i][j].title;
        else taskBlock.innerText = (i + 1) * 1 + ' ' + arrMain[i][j].title; // Убираеем 0 из первой крточки
        taskBlock.addEventListener('click', selectTask);
        taskBlock.addEventListener('dblclick', checkTask);
        newCol.appendChild(taskBlock);
      }

      let butAdd = document.createElement('input');
      butAdd.className += 'form-control mt-1';
      butAdd.setAttribute('type', 'text');
      butAdd.setAttribute('placeholder', 'Add Task');
      butAdd.setAttribute('alt', i);
      butAdd.addEventListener('keydown', addDown); // Навешиваем обработчик нажатия Enter
      newCol.appendChild(butAdd); // Вставляем Кнопку добавления в низ столбца
      rowMain.appendChild(newCol); // Вставляем столбец в строку
    }

    if (teccol) { // Если текущий столбец есть, делаем фокусировку
      let activeInput = document.querySelector('input[alt="' + teccol + '"]');
      activeInput.focus();
    }
    //console.log(arrMain); // Не удалять. Контроль выхода
  }

  // Функция добавления нового значения в массив
  function addDown() {
    //console.log(event.keyCode);
    if (event.keyCode == 13 && this.value.trim() !== '') {

      objTask = { // Создаем, заполняем, вся хуйня с объектом
        id: Date.now(),
        title: this.value,
        import: false,
        check: false
      }

      let i = this.getAttribute('alt'); // Получаем номер столбца в котором была нажата кнопка
      let arrMain = loadArray(); // Затем подгружаем массив из ЛС
      arrMain[i] = arrMain[i] || []; // Хотя, похоже ни к чему проверять на пустоту...
      arrMain[i].push(objTask);

      localStorage.setItem('arrmain', JSON.stringify(arrMain)); // Сохраняем в ЛС
      showArray(arrMain, i); // Отрисовываем массив
    }
  }

  // Функция выделения задачи при клике
  function selectTask(e) {
    // Model, Модель данных
    let i = this.getAttribute('alt'); // Получаем столбец
    let j = this.getAttribute('name'); // И строку
    let arrMain = loadArray(); // Подгружаем массив из ЛС
    arrMain[i][j].import = arrMain[i][j].import ? false : true;

    localStorage.setItem('arrmain', JSON.stringify(arrMain)); // Сохраняем в ЛС
    showArray(arrMain); // Отрисовываем массив

    // View, Представление
    //this.classList.toggle('bg-warning');
    //console.log(this.getAttribute('alt'), ':', this.getAttribute('name'), ' ', this.getAttribute('id'));
  }

  // Функция изменения статуса азадачи выполнено/не выполнено
  function checkTask() {
    let i = this.getAttribute('alt'); // Получаем столбец
    let j = this.getAttribute('name'); // И строку
    let arrMain = loadArray(); // Подгружаем массив из ЛС
    arrMain[i][j].check = arrMain[i][j].check ? false : true;

    localStorage.setItem('arrmain', JSON.stringify(arrMain)); // Сохраняем в ЛС
    showArray(arrMain); // Отрисовываем массив

    //this.classList.toggle('checked');
  }

  // Функция удаления задачи по двойному клику по ней
  function deletTask() {
    let i = this.getAttribute('alt'); // Получаем столбец
    let j = this.getAttribute('name'); // И строку
    let arrMain = loadArray(); // Подгружаем массив из ЛС
    arrMain[i].splice(j, 1); // Удаляем соответвующий элемент массива

    if (arrMain[i].length == 0) {
      arrMain.splice(i, 1); // И если это был последний элемент, удаляем весь столбец
    }

    localStorage.setItem('arrmain', JSON.stringify(arrMain)); // Сохраняем в ЛС
    showArray(arrMain); // Отрисовываем массив
  }

  // Функция добавления нового столбца
  function addColumn() {
    let arrMain = loadArray(); // Подгружаем массив из ЛС
    let i = arrMain.length; // Создаем индекс нового столбца равный длине массива
    let j = i - 1;
    if (arrMain[j].length !== 0 && arrMain.length < 6) { // Проверяем чтоб последний не был пустым или 6-ым
      arrMain[i] = []; // И вставляем туда пустой массив
      localStorage.setItem('arrmain', JSON.stringify(arrMain)); // Сохраняем в ЛС
      showArray(arrMain, i); // Отрисовываем массив
    }
  }

  let butAddColumn = document.querySelector('#butAddColumn');
  butAddColumn.addEventListener('click', addColumn);


}


window.onload = function () {
  ready();
};



