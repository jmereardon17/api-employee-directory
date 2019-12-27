const randomUserAPI = 'https://randomuser.me/api/?results=12&nat=us,gb';
const search = document.getElementById('search');
const sectionGrid = document.querySelector('.grid');
const cards = document.getElementsByClassName('card');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal__content');
const modalClose = document.querySelector('.modal__close');
const modalPrevious = document.querySelector('.modal__left');
const modalNext = document.querySelector('.modal__right');
let employeeData = [];

// ---------------------------------------------
//  FETCH FUNCTIONS
// ---------------------------------------------

const fetchData = url => {
  return fetch(url)
           .then(res => res.json())
           .then(data => generateEmployees(data))
           .catch(err => console.log(err))
}

fetchData(randomUserAPI);

// ---------------------------------------------
//  HELPER FUNCTIONS
// ---------------------------------------------

const generateEmployees = data => {
  employeeData = data;
  let html = ``;
  // loop over all the data and display each peice
  for (let i=0; i<data.results.length; i+=1) {
    let photo = data.results[i].picture.large;
    let name = data.results[i].name.first + ' ' + data.results[i].name.last;
    let email = data.results[i].email;
    let city = data.results[i].location.city;
    html += `
      <div class="card" data-index="${i}">
        <div class="card__image">
        <img src="${photo}" alt="Picture of Employee: ${name}" class="photo">
        </div>
        <div class="card__details">
          <h2 class="card__name">${name}</h2>
          <p class="card__email">${email}</p>
          <p class="card__location">${city}</p>
        </div>
      </div>
    `;
  }
  sectionGrid.innerHTML = html;
}

const displayModal = index => {
  let photo = employeeData.results[index].picture.large;
  let name = employeeData.results[index].name.first + ' ' + employeeData.results[index].name.last;
  let email = employeeData.results[index].email;
  let city = employeeData.results[index].location.city;
  let phone = employeeData.results[index].cell;
  let address = employeeData.results[index].location.street.number + ' ' + employeeData.results[index].location.street.name + ', ' + employeeData.results[index].location.state + ' ' + employeeData.results[index].location.postcode;
  let dob = employeeData.results[index].dob;
  let dobFull = new Date(dob.date);
  const html = `
    <div class="card__image">
      <img src="${photo}" alt="Picture of Employee: ${name}" class="photo">
    </div>
    <div class="card__details">
      <h2 class="card__name">${name}</h2>
      <p class="card__email">${email}</p>
      <p class="card__location">${city}</p>
      <hr>
      <p class="card__phone">${phone}</p>
      <p class="card__address">${address}</p>
      <p class="card__birthday">${dobFull.getDate()}/${dobFull.getMonth()}/${dobFull.getFullYear()}</p>
    </div>
  `;
  overlay.classList.remove('hidden');
  modalContainer.innerHTML = html;
  modalContainer.setAttribute('data-index', index);
  if (parseInt(index) === 0) {
    modalPrevious.style.display = 'none';
  } else {
    modalPrevious.style.display = 'inline-block';
  }
  if (parseInt(index) === 11) {
    modalNext.style.display = 'none';
  } else {
    modalNext.style.display = 'inline-block';
  }
}

const getTargetCard = target => {
  const card = target.closest('.card');
  const index = card.getAttribute('data-index');
  displayModal(index);
}

const searchHandler = () => {
  let input = search.value.toLowerCase();
  const employees = document.querySelectorAll('.card__name');
  for (let i=0; i<employees.length; i+=1) {
    let employee = employees[i].textContent.toLowerCase();
    let card = employees[i].parentNode.parentNode;
    if (employee.indexOf(input) > -1) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  }
  if (input === '') {
    for (let i=0; i<cards.length; i+=1) {
      cards[i].style.display = 'flex';
    }
  }
}

// ---------------------------------------------
//  EVENT LISTENERS
// ---------------------------------------------

sectionGrid.addEventListener('click', e => {
  if (e.target !== sectionGrid) {
    getTargetCard(e.target);
  }
});

search.addEventListener('keyup', searchHandler);

modalClose.addEventListener('click', () => overlay.classList.add('hidden'));

modalPrevious.addEventListener('click', e => {
  const card = e.target.nextElementSibling.nextElementSibling;
  let index = parseInt(card.getAttribute('data-index'));
  index -= 1;
  if (index !== -1) {
    displayModal(index);
  }
});

modalNext.addEventListener('click', e => {
  const card = e.target.nextElementSibling;
  let index = parseInt(card.getAttribute('data-index'));
  index += 1;
  if (index !== 12) {
    displayModal(index);
  }
});