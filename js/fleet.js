const cars = [
  {
    id: 1,
    slug: 'alphard',
    name: 'Toyota Alphard 2011',
    category: 'mini-van',
    image: '../img/cars/toyota alphard 2011.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2011,
    type: 'Luxury',
    rating: 4.8
  },
  {
    id: 2,
    slug: 'mitsubishi-asx',
    name: 'Mitsubishi ASX',
    category: 'suv',
    image: '../img/cars/Mitsubishi ASX .png',
    passengers: 4,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2018,
    type: 'SUV',
    rating: 4.9
  },
  {
    id: 3,
    slug: 'suzuki-ertiga-type-3',
    name: 'Suzuki Ertiga Type 3',
    category: 'sports',
    image: '../img/cars/suzuki ertiga type 3.jpg',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2019,
    type: 'SUV',
    rating: 4.0
  },
  {
    id: 4,
    slug: 'toyota-hiace',
    name: 'Toyota Hiace',
    category: 'mini-van',
    image: '../img/cars/toyota_hiace.png',
    passengers: 14,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2005,
    type: 'Mini Van',
    rating: 4.5
  },
  {
    id: 5,
    slug: 'suzuki-type-2',
    name: 'Suzuki Type 2',
    category: 'saloon',
    image: '../img/cars/suzuki ertiga type 2.jpg',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2018,
    type: 'Saloon',
    rating: 4.0
  },

  {
    id: 6,
    slug: 'mark-ii',
    name: 'Toyota Mark II',
    category: 'saloon',
    image: '../img/cars/toyota_mark2_gray.jpg',
    passengers: 3,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2000,
    type: 'Saloon',
    rating: 4.8
  },
  {
    id: 7,
    slug: 'majesty',
    name: 'Toyota Majesty',
    category: 'van',
    image: '../img/cars/toyota_majesty.jpg',
    passengers: 8,
    transmission: 'Automatic',
    fuel: 'Diesel',
    year: 2018,
    type: 'Van',
    rating: 4.6
  },
  {
    id: 8,
    slug: 'wish',
    name: 'Toyota Wish',
    category: 'saloon',
    image: '../img/cars/toyota_wish.jpg',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2003,
    type: 'Saloon',
    rating: 4.1
  },
  {
    id: 9,
    slug: 'fielder',
    name: 'Toyota Fielder',
    category: 'saloon',
    image: '../img/cars/toyota_fielder.jpg',
    passengers: 4,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2008,
    type: 'Saloon',
    rating: 4.0
  },
  {
    id: 10,
    slug: 'prado',
    name: 'Toyota Prado',
    category: 'suv',
    image: '../img/cars/toyota_prado.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Diesel',
    year: 2006,
    type: 'SUV',
    rating: 4.5
  },
  {
    id: 11,
    slug: 'alphard-2002',
    name: 'Toyota Alphard 2002',
    category: 'mini-van',
    image: '../img/cars/toyota_alphard_2002.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2002,
    type: 'Mini Van',
    rating: 4.3
  },
  {
    id: 12,
    slug: 'alphard-2003',
    name: 'Toyota Alphard 2003',
    category: 'mini-van',
    image: '../img/cars/toyota_alphard_2003.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2003,
    type: 'Mini Van',
    rating: 4.2
  },
  {
    id: 13,
    slug: 'alphard-2005',
    name: 'Toyota Alphard 2005',
    category: 'mini-van',
    image: '../img/cars/toyota_alphard_2005.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2005,
    type: 'Mini Van',
    rating: 4.4
  },
  {
    id: 14,
    slug: 'hiace-9-seater',
    name: 'Toyota Hiace 9-Seater',
    category: 'mini-van',
    image: '../img/cars/toyota_hiace_9_seater.jpg',
    passengers: 9,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2008,
    type: 'SUV',
    rating: 4.3
  },
  {
    id: 15,
    slug: 'honda-fit',
    name: 'Honda Fit',
    category: 'saloon',
    image: '../img/cars/honda_fit.jpg',
    passengers: 3,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2010,
    type: 'Saloon',
    rating: 4.0
  },
  {
    id: 16,
    slug: 'attrage',
    name: 'Mitsubishi Attrage',
    category: 'saloon',
    image: '../img/cars/mitsubishi_attrage.jpg',
    passengers: 3,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2019,
    type: 'Saloon',
    rating: 4.1
  },
  {
    id: 17,
    slug: 'mirage',
    name: 'Mitsubishi Mirage',
    category: 'saloon',
    image: '../img/cars/mitsubishi_mirage.jpg',
    passengers: 4,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2016,
    type: 'Saloon',
    rating: 4.0
  },
  {
    id: 18,
    slug: 'zinger',
    name: 'Mitsubishi Zinger',
    category: 'suv',
    image: '../img/cars/mitsubishi_zinger.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2013,
    type: 'SUV',
    rating: 4.2
  },
  {
    id: 19,
    slug: 'pajero-sport',
    name: 'Mitsubishi Pajero Sport',
    category: 'suv',
    image: '../img/cars/mitsubishi_pajero_sport.jpg',
    passengers: 6,
    transmission: 'Automatic',
    fuel: 'Diesel',
    year: 2020,
    type: 'SUV',
    rating: 4.7
  },
  {
    id: 20,
    slug: 'ertiga-type-4',
    name: 'Suzuki Ertiga Type 4',
    category: 'suv',
    image: '../img/cars/suzuki_ertiga_type_4.jpg',
    passengers: 5,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2024,
    type: 'SUV',
    rating: 4.4
  },
  // {
  //   id: 21,
  //   slug: 'isuzu-van-2008',
  //   name: 'ISUZU VAN 2008',
  //   category: 'truck',
  //   image: '../img/cars/isuzu van 2008.jpg',
  //   passengers: 6,
  //   transmission: 'Manual',
  //   fuel: 'Diesel',
  //   year: 2008,
  //   type: 'Truck',
  //   rating: 4.2
  // },
  {
    id: 22,
    slug: 'xpendar',
    name: 'Mitsubishi Xpendar',
    category: 'suv',
    image: '../img/cars/mitsubishi_xpendar.jpg',
    passengers: 7,
    transmission: 'Automatic',
    fuel: 'Gasoline',
    year: 2020,
    type: 'SUV',
    rating: 4.6
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
      <div id="${car.slug}" class="categories-item p-4">
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

// window.addEventListener('DOMContentLoaded', () => {
//   const hash = window.location.hash?.substring(1); // e.g. "bmw-x5"
//   if (hash) {
//     // Wait a tiny bit to ensure DOM is ready
//     setTimeout(() => {
//       const target = document.getElementById(hash);
//       if (target) {
//         target.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         target.classList.add('highlighted'); // Optional visual effect
//       }
//     }, 300); // delay to ensure cards are loaded
//   }
// });


window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash?.substring(1); // e.g. "bmw-x5"
  if (hash) {
    // Wait a tiny bit to ensure DOM is ready
    setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        const headerOffset = 100; // adjust this to match your fixed header height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        target.classList.add('highlighted'); // Optional visual effect
      }
    }, 300);
    // delay to ensure cards are loaded
  }
});


