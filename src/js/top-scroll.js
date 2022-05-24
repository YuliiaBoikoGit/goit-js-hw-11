import getRefs from './refs.js';
const refs = getRefs();

function onScrollBtnClick() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

function onScrollToTop() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        refs.topScrollBtn.style.display = "block";
    } else {
        refs.topScrollBtn.style.display = "none";
    };
};

export { onScrollBtnClick, onScrollToTop }