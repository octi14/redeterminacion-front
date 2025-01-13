import axios from 'axios';

/**
 * Método para registrar la actividad del usuario.
 * @param {string} userId - El ID del usuario.
 * @param {string} actionType - El tipo de acción realizada por el usuario.
 * @param {string} actionResult - El resultado de la acción (éxito, fallo, etc.).
 * @param {string} sessionId - El identificador de la sesión del usuario.
 * @param {string} [visitedUrl] - La URL visitada por el usuario (opcional).
 */
/**
 * Método para obtener el tipo de dispositivo del usuario.
 * @returns {string} - El tipo de dispositivo (PC, móvil, tableta, etc.).
 */
function getDeviceType() {
    // Utilizando el objeto 'navigator.userAgent' para determinar el tipo de dispositivo
    const userAgent = navigator.userAgent;
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent)) {
        return 'Móvil';
    } else if (/Tablet|iPad/.test(userAgent)) {
        return 'Tableta';
    } else {
        return 'PC';
    }
}

/**
 * Método para obtener el sistema operativo del usuario.
 * @returns {string} - El sistema operativo del usuario.
 */
function getOperatingSystem() {
    // Utilizando el objeto 'navigator.userAgent' para determinar el sistema operativo
    const userAgent = navigator.userAgent;
    if (/Windows/.test(userAgent)) {
        return 'Windows';
    } else if (/Macintosh|Mac OS/.test(userAgent)) {
        return 'Mac OS';
    } else if (/Android/.test(userAgent)) {
        return 'Android';
    } else if (/iOS/.test(userAgent)) {
        return 'iOS';
    } else if (/Linux/.test(userAgent)) {
        return 'Linux';
    } else {
        return 'Sistema operativo desconocido';
    }
}

/**
 * Método para obtener la resolución de pantalla del usuario.
 * @returns {string} - La resolución de pantalla del usuario.
 */
function getScreenResolution() {
    // Obteniendo la resolución de pantalla utilizando 'window.screen.width' y 'window.screen.height'
    return `${window.screen.width}x${window.screen.height}`;
}

/**
 * Método para obtener información sobre el navegador del usuario.
 * @returns {string} - Información sobre el navegador del usuario.
 */
function getBrowserInfo() {
    // Utilizando el objeto 'navigator.userAgent' para obtener información sobre el navegador
    return navigator.userAgent;
}

export default (context, inject) => {
    const logUserActivity = async (userId, actionType, actionResult, visitedUrl = null) => {
        try {
            const logUserActivityEnabled = true;
            if (logUserActivityEnabled) {
                if (!visitedUrl) {
                    visitedUrl = window.location.href;
                }

                //const sessionId = getCookie('sessionId');
                const sessionId = "FALLO GETCOOKIE";

                const deviceInfo = {
                    deviceType: getDeviceType(),
                    os: getOperatingSystem(),
                    resolution: getScreenResolution(),
                    browserInfo: getBrowserInfo(),
                };

                const data = {
                    userId,
                    actionType,
                    actionResult,
                    sessionId,
                    visitedUrl,
                    deviceInfo,
                };
                const response = await context.$axios.post('/api/user-activity', data);
            } else {
                //console.log('Logs desactivados.');
            }
        } catch (error) {
            console.error('Error al registrar actividad:', error);
        }
    };
    // Función para obtener el valor de una cookie por su nombre
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    // Inyectar la función en la app para usarla con this.$logUserActivity
    inject('logUserActivity', logUserActivity);
};