import './css/styles.css';
import FetchImagesApiService from './js/fetchImages.js';
import getRefs from './js/refs.js';
import { onScrollBtnClick, onScrollToTop } from './js/top-scroll.js';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = getRefs();
const fetchImagesApiService = new FetchImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.searchInput.addEventListener('input', onInputChange);
refs.searchInput.addEventListener('input', onEmptyInput);
refs.imageCardList.addEventListener('click', onGalleryItemClick);
refs.topScrollBtn.addEventListener('click', onScrollBtnClick);
window.addEventListener('scroll', onLoadMoreImages);
window.addEventListener('scroll', onScrollToTop);


async function onSearch(event) {
    event.preventDefault();

    clearImageList();

    fetchImagesApiService.name = event.currentTarget.elements.searchQuery.value;
    fetchImagesApiService.resetPage();

    try {
        const images = await fetchImagesApiService.fetchImages();
        renderImageList(images);
        smoothScroll(images);
    } catch (error) {
        Notiflix.Notify.failure('Something went wrong');
    }

    refs.searchForm.reset();
    onEmptyInput();

};

function renderImageList(images) {
    if (images.total === 0) {
        onSearchError();
        return;
    };

    if (images.hits.length === 0) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        return;
    };

    refs.imageCardList.insertAdjacentHTML('beforeend', makeImageCardListMarkup(images));

    const lightboxGallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250
    });

    lightboxGallery.on('show.simplelightbox');
};

function makeImageCardListMarkup(images) {
    const imageCardListMarkup = images.hits
        .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
            return `<div class="photo-card">
    <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
        <p class="info-item">
            <div class="tooltip">
              <b>${likes}</b>
              <span class="likes"></span>
              <span class="tooltiptext">Likes</span>
           </div>
        </p>
        <p class="info-item">
        <div class="tooltip">
            <b>${views}</b>
            <span class="views"></span>
           <span class="tooltiptext">Views</span>
        </div>    
        </p>
        <p class="info-item">
        <div class="tooltip">
            <b>${comments}</b>
            <span class="comments"></span>
            <span class="tooltiptext">Comments</span>
        </div>
        </p>
        <p class="info-item">
        <div class="tooltip">
            <b>${downloads}</b>
            <span class="downloads"></span>
            <span class="tooltiptext">Downloads</span>
        </div>
        </p>
    </div>
</div>`;
        }).join('');

    return imageCardListMarkup;
};

function onGalleryItemClick(event) {
    event.preventDefault();
};

function onSearchError(error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
};

async function onLoadMoreImages(event) {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        const images = await fetchImagesApiService.fetchImages();
        renderImageList(images);
    };
};

function clearImageList() {
    refs.imageCardList.innerHTML = '';
};

function smoothScroll() {
    if (refs.imageCardList.firstElementChild) {
        const { height: cardHeight } = refs.imageCardList
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * -100,
            behavior: "smooth",
        });
    }
};

function onInputChange() {
    if (refs.searchInput.value !== '') {
        refs.searchBtn.disabled = false;
        refs.searchBtn.classList.add('active');
    };
};

function onEmptyInput() {
    if (refs.searchInput.value === '') {
        refs.searchBtn.disabled = true;
        refs.searchBtn.classList.remove('active');
    };
};