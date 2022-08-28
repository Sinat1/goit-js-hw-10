import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './API/fetchCountries';
import countryCardTpl from './templates/country-card.hbs';
import countryItemTpl from './templates/country-item.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfoDiv: document.querySelector('.country-info'),
};

function renderCountries(countries) {
  if (countries.length === 1) {
    const markup = countries
      .map(country => {
        const languages = Object.values(country.languages).join(',');
        country.languages = languages;
        return countryCardTpl(country);
      })
      .join('');
    refs.countryInfoDiv.innerHTML = markup;
    refs.countryList.innerHTML = '';
  } else if (countries.length > 10) {
    refs.countryList.innerHTML = '';
    refs.countryInfoDiv.innerHTML = '';
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length > 1 && countries.length <= 10) {
    const markup = countries
      .map(country => {
        return countryItemTpl(country);
      })
      .join('');
    refs.countryList.innerHTML = markup;
    refs.countryInfoDiv.innerHTML = '';
  }
}

function onFetchError(error) {
  if (Number(error.message) === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    refs.countryList.innerHTML = '';
    refs.countryInfoDiv.innerHTML = '';
  }
}

function onSearchInput(event) {
  const countryName = event.target.value.trim();

  if (!countryName) {
    refs.countryList.innerHTML = '';
    refs.countryInfoDiv.innerHTML = '';
    throw new Error('An error occured while fetching data');
  }

  fetchCountries(countryName).then(renderCountries).catch(onFetchError);
}

refs.searchInput.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);
