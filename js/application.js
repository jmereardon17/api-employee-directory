const search = document.getElementById('search');
const sectionGrid = document.querySelector('.grid');
const cards = document.querySelectorAll('.card');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal__content');
const modalClose = document.querySelector('.modal__close');
const modalBtns = document.querySelectorAll('.modal button');
const modalPrevious = document.querySelector('.modal__left');
const modalNext = document.querySelector('.modal__right');
let employeeData = [];

// ---------------------------------------------
//  HELPER FUNCTIONS
// ---------------------------------------------

const generateEmployees = data => {
  employeeData = data.results;
  let html = ``;

  employeeData.forEach((employee, i) => {
    const { name: { first, last }, email, location: { city }, picture } = employee;
    const name = `${first} ${last}`;

    html += `<section class="card" data-index=${i}>
      <section class="card__image">
        <img class="photo" src=${picture.large} alt="Picture of Employee: ${name}">
      </section>
      <section class="card__details">
        <h2 class="card__name">${name}</h2>
        <p class="card__email">${email}</p>
        <p class="card__location">${city}</p>
      </section>
    </section>`;
  });

  sectionGrid.innerHTML = html;
}

const displayModal = index => {
  const { name: { first, last }, email, location, picture, cell, dob } = employeeData[index];
  const name = `${first} ${last}`;
  const address = `${location.street.number} ${location.street.name} ${location.state} ${location.postcode}`;
  const dobFull = new Date(dob.date);
  const html = `<section class="card__image">
      <img src="${picture.large}" alt="Picture of Employee: ${name}" class="photo">
    </section>
    <section class="card__details">
      <h2 class="card__name">${name}</h2>
      <p class="card__email">${email}</p>
      <p class="card__location">${location.city}</p>
      <hr>
      <p class="card__phone">${cell}</p>
      <p class="card__address">${address}</p>
      <p class="card__birthday">${dobFull.getDate()}/${dobFull.getMonth()}/${dobFull.getFullYear()}</p>
    </section>`;

  overlay.classList.remove('hidden');
  modalContainer.innerHTML = html;
  modalContainer.style.display = 'block';
  modalContainer.setAttribute('data-index', index);
  modalPrevious.style.display = parseInt(index) === 0 ? 'none' : 'inline-block';
  modalNext.style.display = parseInt(index) === employeeData.length - 1 ? 'none' : 'inline-block';
}

const getTargetCard = target => {
  const card = target.closest('.card');
  const index = card.getAttribute('data-index');
  displayModal(index);
}

const searchHandler = () => {
  const input = search.value.toLowerCase();
  const employees = document.querySelectorAll('.card__name');

  employees.forEach(employee => {
    const employeeName = employee.textContent.toLowerCase();
    const card = employee.parentNode.parentNode;
    card.style.display = employeeName.indexOf(input) > -1 ? 'flex' : 'none';
  });

  input === '' && cards.forEach(card => card.style.display = 'flex');
}

// ---------------------------------------------
//  EVENT LISTENERS
// ---------------------------------------------

sectionGrid.addEventListener('click', e => e.target !== sectionGrid && getTargetCard(e.target));
search.addEventListener('keyup', searchHandler);
modalClose.addEventListener('click', () => overlay.classList.add('hidden'));

modalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.className === 'modal__left' ? btn.nextElementSibling.nextElementSibling : btn.nextElementSibling;
    let index = parseInt(card.getAttribute('data-index'));
    index += btn.className === 'modal__left' ? -1 : +1;
    
    if (index !== -1 && index !== employeeData.length) displayModal(index);
  });
});

fetch('https://randomuser.me/api/?results=12&nat=us,gb')
  .then(res => res.json())
  .then(generateEmployees)
  .catch(err => console.log(err));