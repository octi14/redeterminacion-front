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
export async function logUserActivity(axios, userId, actionType, actionResult, sessionId, visitedUrl = null) {
    try {
        // Obtener la URL visitada si no se proporcionó como parámetro
        if (!visitedUrl) {
            visitedUrl = window.location.href;
        }

        // Recopilar información del dispositivo y navegador
        const deviceInfo = {
            deviceType: getDeviceType(),
            os: getOperatingSystem(),
            resolution: getScreenResolution(),
            browserInfo: getBrowserInfo()
        };

        // Datos a enviar al servidor
        const data = {
            userId: userId,
            actionType: actionType,
            actionResult: actionResult,
            sessionId: sessionId,
            visitedUrl: visitedUrl,
            deviceInfo: deviceInfo
        };

        // Enviar los datos al servidor utilizando Axios o tu librería HTTP preferida
        //const response = await axios.post('URL_DEL_ENDPOINT_PARA_REGISTRAR_ACTIVIDAD', data);
        console.log('logUserActivity() CALLED');
        console.log('userId:' + userId);
        console.log('actionType:' + actionType);
        console.log('actionResult:' + actionResult);
        console.log('sessionId:' + sessionId);
        console.log('visitedUrl:' + visitedUrl);
        console.log('deviceInfo.getDeviceType:' + deviceInfo.deviceType);
        console.log('deviceInfo.getOperatingSystem:' + deviceInfo.os);
        console.log('deviceInfo.getScreenResolution:' + deviceInfo.resolution);
        console.log('deviceInfo.getBrowserInfo:' + deviceInfo.browserInfo);

        // Manejar la respuesta del servidor si es necesario
        await axios.post('/api/user-activity', data);
        console.log('Registro de actividad exitoso:', response.data);

    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante el registro de la actividad
        console.error('Error al registrar actividad:', error);
    }
}

