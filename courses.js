const form = document.querySelector('#add-form');
const input = document.querySelector('#course-input');
const tip = document.querySelector('#tip');
const list = document.querySelector('#course-list');
const filters = document.querySelector('.filters');
const search = document.querySelector('#search');

let courses = JSON.parse(localStorage.getItem('courses') || '[]');
let currentFilter = 'all';
let searchKey = '';

const save = () => localStorage.setItem('courses', JSON.stringify(courses));

const render = () => {
  list.innerHTML = '';
  const shown = courses.filter(t => {
    const matchFilter = currentFilter === 'all' ? true :
      currentFilter === 'active' ? !t.done : t.done;
    const matchSearch = searchKey === '' || t.text.includes(searchKey);
    return matchFilter && matchSearch;
  });
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.textContent = '没有符合条件的课程';
    list.appendChild(li);
    return;
  }
  shown.forEach(course => {
    const li = document.createElement('li');
    li.textContent = course.text;
    if (course.done) li.classList.add('done');
    li.addEventListener('click', () => {
      course.done = !course.done;
      save();
      render();
    });
    li.addEventListener('dblclick', () => {
      const newText = window.prompt('修改课程名：', course.text);
      if (newText !== null && newText.trim() !== '') {
        course.text = newText.trim();
        save();
        render();
      }
    });
    list.appendChild(li);
  });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === '') {
    tip.textContent = '课程名不能为空';
    return;
  }
  courses.push({ text: text, done: false });
  save();
  tip.textContent = '';
  input.value = '';
  searchKey = '';
  render();
});

filters.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  currentFilter = e.target.dataset.filter;
  input.value = '';
  searchKey = '';
  render();
});

search.addEventListener('click', () => {
  searchKey = input.value.trim();
  render();
});

render();