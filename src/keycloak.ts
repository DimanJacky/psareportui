import Keycloak from 'keycloak-js';

const keycloak = Keycloak({
    // @ts-ignore
    url: window.KEYCLOAK_ADDRESS + '/auth',
    realm: 'neoflex',
    clientId: 'psa-ui',
});

export default keycloak;