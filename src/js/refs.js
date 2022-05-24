export default function getRefs() {
    return {
        searchForm: document.querySelector('#search-form'),
        searchInput: document.querySelector('input'),
        searchBtn: document.querySelector('button'),
        imageCardList: document.querySelector('.gallery'),
        topScrollBtn: document.querySelector('#scrollToTopBtn'),
    };
}