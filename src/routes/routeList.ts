import loadable from '../utils/loadable.js';

export const routeList = [

    {
        path: '/character',
        title: 'Arknights',
        component: loadable(() => import('../pages/character'))
    },


];
