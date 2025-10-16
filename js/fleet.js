const cars = [
  {
    id: 1,
    name: 'Ferrari 488 GTB',
    category: 'luxury',
    image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2020,
    type: 'Sports',
    rating: 4.8
  },
  {
    id: 2,
    name: 'BMW X5',
    category: 'suv',
    image: 'https://images.pexels.com/photos/7154532/pexels-photo-7154532.jpeg',
    passengers: 7,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2019,
    type: 'SUV',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Porsche 911',
    category: 'sports',
    image: 'https://images.pexels.com/photos/3972755/pexels-photo-3972755.jpeg?auto=compress&cs=tinysrgb&w=600',
    passengers: 2,
    transmission: 'Manual',
    fuel: 'Gasoline',
    year: 2021,
    type: 'Sports',
    rating: 5.0
  },
  {
    id: 4,
    name: 'Suzuki Swift GL',
    category: 'economy',
    image: 'https://tse1.mm.bing.net/th/id/OIP.UsqrypkcuEEbAtGwn4cVZgHaE8',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2018,
    type: 'Economy',
    rating: 4.8
  }
];

const carsGrid = document.getElementById('cars-grid');
const categoryButtons = document.querySelectorAll('.category-btn');

function displayCars(category) {
  carsGrid.innerHTML = '';
  const filtered = category === 'all' ? cars : cars.filter(c => c.category === category);

  filtered.forEach(car => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    // Generate stars dynamically
    const fullStars = Math.floor(car.rating);
    const hasHalfStar = car.rating % 1 !== 0;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += `<i class="fa-solid fa-star text-warning-emphasis"></i>`;
    if (hasHalfStar) starsHTML += `<i class="fa-solid fa-star-half text-warning-emphasis"></i>`;

    col.innerHTML = `
      <div class="categories-item p-4">
        <div class="categories-item-inner">
          <div class="categories-img rounded-top">
            <img src="${car.image}" class="img-fluid w-100 rounded-top" alt="${car.name}" />
          </div>
          <div class="categories-content rounded-bottom p-4">
            <h4>${car.name}</h4>
            <div class="categories-review mb-4">
              <div class="me-3">${car.rating} Review</div>
              <div class="d-flex justify-content-center text-secondary">
                ${starsHTML}
              </div>
            </div>
            <div class="row gy-2 gx-0 text-center mb-4">
              <div class="col-4 border-end border-white">
                <i class="fa fa-users text-dark"></i><span class="text-body ms-1">${car.passengers} Seat</span>
              </div>
              <div class="col-4">
                <i class="fa fa-gas-pump text-dark"></i><span class="text-body ms-1">${car.fuel}</span>
              </div>
              <div class="col-4 border-end border-white">
                <i class="bi bi-calendar-event-fill"></i><span class="text-body ms-1">${car.year}</span>
              </div>
              <div class="col-4 border-end border-white">
                <i class="fa fa-cogs text-dark"></i><span class="text-body ms-1">${car.transmission}</span>
              </div>
              <div class="col-4 border-end border-white">
                <i class="fa fa-car text-dark"></i><span class="text-body ms-1">${car.type}</span>
              </div>
            </div>
            <a href="#" class="btn btn-primary rounded-pill d-flex justify-content-center py-3">Book Now</a>
          </div>
        </div>
      </div>
    `;

    carsGrid.appendChild(col);
  });
}

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    displayCars(btn.dataset.category);
  });
});

// Initial load
displayCars('all');
