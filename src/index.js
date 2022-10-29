import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import "./css/styles.css";
import imgCard from './imgCard.hbs';

const axios = require('axios').default;
const base_url = 'https://pixabay.com/api/';
const KEY = '30906362-b5b03bb7697802982655c2c3d';
const form = document.querySelector('.search-form');
const input = document.querySelector('[type="text"]');
const moreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let galleryLightbox = new SimpleLightbox(".gallery a");

let page = 1;

const params = new URLSearchParams({
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40
});

moreBtn.style.visibility='hidden';

form.addEventListener('submit', onSearch);

function onSearch(e) {
    e.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    moreBtn.style.visibility='hidden';
    fetchImgs().then((resp) => {console.log(resp);
        if (resp.data.hits.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        } else {
            moreBtn.style.visibility='visible';
            Notify.success(`Hooray! We found ${resp.data.totalHits} images.`)
            searchImgs();
        }
    }).catch((error) => console.log(error));
}

moreBtn.addEventListener('click', seeMoreImgs);

function seeMoreImgs() {page += 1;
    fetchImgs().then(imgs => {
            console.log(imgs);
            gallery.insertAdjacentHTML('beforeend', imgCard(imgs.data.hits));
            galleryLightbox.refresh();
        const totalHits = imgs.data.totalHits / 40;
        if (page >= totalHits) {
            moreBtn.style.visibility = 'hidden';
            Notify.info("We're sorry, but you've reached the end of search results.")
        }
    }).catch((error) => console.log(error));
}

    function searchImgs() {
        fetchImgs().then(imgs => {
            console.log(imgs);
            gallery.insertAdjacentHTML('beforeend', imgCard(imgs.data.hits));
            galleryLightbox.refresh();
        }).catch((error) => console.log(error));
    }
    
    async function fetchImgs() {
        return await axios.get(`${base_url}?${params}&q=${input.value}&page=${page}`);
    }