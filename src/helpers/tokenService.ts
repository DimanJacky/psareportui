// import Cookies from 'universal-cookie';


type Storage = {
    // eslint-disable-next-line no-unused-vars
    setAccessToken: (token: string) => void
    getAccessToken: () => string | null
    removeAccessToken: () => void
    // eslint-disable-next-line no-unused-vars
    set: (name: string, value: string, options?: object) => void
    // eslint-disable-next-line no-unused-vars
    get: (name: string) => string | null
    // eslint-disable-next-line no-unused-vars
    remove: (name: string) => void
};


const storage = localStorage;

const tokenStorage: Storage = {
    setAccessToken: (accessToken) => {
        // set cookie until midnight
        const date = new Date();
        const night = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);

        tokenStorage.set('accessToken', accessToken, { maxAge: (night.valueOf() - date.valueOf()) / 1000 });
    },
    getAccessToken: () => {
        return tokenStorage.get('accessToken');
    },
    removeAccessToken: () => {
        tokenStorage.remove('accessToken');
    },
    remove: (name: string) => {
        storage.removeItem(name);
    },
    set: (name, value) => {
        // options = Object.assign({ path: '/', maxAge: 86400 }, options);

        storage.setItem(name, value);
    },
    get: (name) => {
        return storage.getItem(name);
    }
};

export default { tokenStorage };
