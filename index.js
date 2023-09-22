document.addEventListener("DOMContentLoaded", (event) => {
  populateBeerList();
});

let select;
let beerListItems;

function populateBeerList() {
  const beerList = document.getElementById('beerList');
  const fetchUrl = 'http://localhost:3000/beers';
  beerList.innerHTML = '';

  fetch(fetchUrl)
    .then(res => res.json())
    .then(beerItems => {
      beerItems.forEach(beer => {
        const beerId = beer.id;

        const beerLi = document.createElement('li');
        beerLi.innerHTML = `
          <h3>
              <a class="toggleswitch" href="javascript:void(0)">Name: ${beer.name}</a>
          </h3>
          <div class="displayNone moreinfoContainer">
              <p>ABV: ${beer.abv}</p>
              <p>First Brewed: ${beer.first_brewed}</p>
              <div class="photo">
                  <img src=${beer.image_url} alt="beer image"/>
              </div>
              <p>Tagline: ${beer.tagline}</p>
              <h3>Description</h3>
              <div class="descriptioncontainer">
                  <p class="descriptiontext">Description: ${beer.description}</p>
              </div>
              <form class="edit">
                  <textarea placeholder="Edit details section here..."></textarea>
                  <button type="submit">Submit</button>
              </form>
          </div>
        `;
        beerLi.setAttribute('id', beer.id);
        beerLi.setAttribute('beerstyle', beer.style);

        if (beer.gluten_free) {
          beerLi.setAttribute('gluten-free', 'y');
        } else {
          beerLi.setAttribute('gluten-free', 'n');
        }

        beerList.appendChild(beerLi);

        const toggleSwitch = beerLi.querySelector('.toggleswitch');
        toggleSwitch.addEventListener('click', () => handleBeerNameClick(beerLi));

        const descriptionText = beerLi.querySelector('.descriptiontext');
        handleEdit(beerLi, descriptionText, beerId);
      });

      filterBeer();
    });
}

function handleBeerNameClick(beerLi) {
  const moreInfoContainer = beerLi.querySelector('.moreinfoContainer');
  if (moreInfoContainer) {
    moreInfoContainer.classList.toggle('displayNone');
  }
}

function filterBeer() {
  const nav = document.querySelector('nav');
  select = document.createElement('select');
  const placeholderOption = document.createElement('option');
  placeholderOption.textContent = 'Select category to filter';
  select.appendChild(placeholderOption);
  nav.appendChild(select);

  const uniqueStyles = [];
  beerListItems = document.querySelectorAll('#beerList li');
  beerListItems.forEach(beerLi => {
    const beerStyle = beerLi.getAttribute('beerstyle');
    if (beerStyle && !uniqueStyles.includes(beerStyle)) {
      uniqueStyles.push(beerStyle);
      const option = document.createElement('option');
      option.textContent = beerStyle;
      select.appendChild(option);
    }
  });

  select.addEventListener('change', handleSelect);
}

function handleSelect() {
  const selectedOption = select.options[select.selectedIndex];
  const selectedStyle = selectedOption.value;
  beerListItems.forEach(beerLi => {
    const beerStyle = beerLi.getAttribute('beerstyle');
    if (selectedStyle === 'Select category to filter' || selectedStyle === beerStyle) {
      beerLi.style.display = 'block';
    } else {
      beerLi.style.display = 'none';
    }
  });
}

function handleEdit(beerLi, descriptionText, beerId) {
  const form = beerLi.querySelector('.edit');
  const textarea = form.querySelector('textarea');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newDescription = textarea.value;
    const patchUrl = `http://localhost:3000/beers/${beerId}`;
    fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "description": newDescription
      })
    })
    .then(res => res.json())
    .then(updatedBeer => {
      descriptionText.textContent = `Description: ${updatedBeer.description}`;
    })
    .catch(error => {
      console.error("Error updating beer description:", error);
    });
    textarea.value = '';
  });
}