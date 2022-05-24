import Notiflix from 'notiflix';
const axios = require('axios');

export default class FetchImagesApiService {
    constructor() {
        this.imageName = '';
        this.page = 1;
    }

    fetchImages() {
        const API_KEY = '27533830-30fc9ccf4273747a8d0d8a9f2';
        const BASE_URL = 'https://pixabay.com/api/';
        const searchParams = new URLSearchParams({
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: this.page,
        });

        return axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.imageName}&${searchParams}`)
            .then(response => {
                if (this.page === 1 && response.data.total > 0) {
                    Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);
                };

                this.incrementPage();

                return response.data;
            });
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get name() {
        return this.imageName;
    };

    set name(newName) {
        this.imageName = newName;
    };

}