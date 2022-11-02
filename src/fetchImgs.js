const axios = require('axios').default;
const base_url = 'https://pixabay.com/api/';
const KEY = '30906362-b5b03bb7697802982655c2c3d';
const input = document.querySelector('[type="text"]');

const params = new URLSearchParams({
    key: KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40
});

export async function fetchImgs(page) {
    try { return await axios.get(`${base_url}?${params}&q=${input.value}&page=${page}`); }
    catch (e) {
        console.log(e);
    }
}