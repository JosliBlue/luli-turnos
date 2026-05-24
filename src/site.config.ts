/**
 * URL pública del sitio (sin barra final).
 * Actualizala al desplegar (Netlify, Vercel, dominio propio, etc.).
 */
export const SITE_URL = 'https://luli-turnos.netlify.app';

export const SITE = {
    name: 'Luli Turnos',
    title: 'Luli Turnos — Calendario mensual para imprimir horarios',
    description:
        'Crea e imprime horarios mensuales personalizables. Elige los días de la semana, anota turnos en cada día y guarda tu calendario en el navegador.',
    locale: 'es_AR',
    language: 'es',
    author: 'josliblue',
    twitterHandle: '@josliblue',
    themeColor: '#fdcb9e',
    ogImage: '/luli-turnos.webp',
    ogImageAlt: 'Logo de Luli Turnos',
} as const;
