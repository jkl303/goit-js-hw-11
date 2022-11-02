import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import "./css/styles.css";
import "./css/gallery.css"
import { fetchImgs } from './fetchImgs';
import imgCard from './imgCard.hbs';

const form = document.querySelector('.search-form');
const input = document.querySelector('[type="text"]');
const moreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let galleryLightbox = new SimpleLightbox(".gallery a");

moreBtn.style.visibility='hidden';

form.addEventListener('submit', onSearch);

let page = 1;

async function onSearch(e) {
    try {
        e.preventDefault();
        page = 1;
        gallery.innerHTML = '';
        moreBtn.style.visibility = 'hidden';
        const imgs = await fetchImgs(page);
        if (imgs.data.totalHits === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        else if (input.value.trim() === '') {
            Notify.info('Type something!');
        } else {
            moreBtn.style.visibility = 'visible';
            Notify.success(`Hooray! We found ${imgs.data.totalHits} images.`)
            gallery.insertAdjacentHTML('beforeend', imgCard(imgs.data.hits));
            galleryLightbox.refresh();
        }
    }
        catch (e) {
            console.log(e);
        }
    }


moreBtn.addEventListener('click', seeMoreImgs);

async function seeMoreImgs() {
    try {
        page += 1;
        const imgs = await fetchImgs(page);
        gallery.insertAdjacentHTML('beforeend', imgCard(imgs.data.hits));
        galleryLightbox.refresh();
        const totalPages = imgs.data.totalHits / 40;
        if (page >= totalPages) {
            moreBtn.style.visibility = 'hidden';
            setTimeout(() => { Notify.info("We're sorry, but you've reached the end of search results."); }, 500)
            }
        } catch (e) {
            console.log(e);
        }
    }