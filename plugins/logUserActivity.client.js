function getDeviceType() {
  const userAgent = navigator.userAgent
  if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent)) {
    return 'Móvil'
  }
  if (/Tablet|iPad/.test(userAgent)) {
    return 'Tableta'
  }
  return 'PC'
}

function getOperatingSystem() {
  const userAgent = navigator.userAgent
  if (/Windows/.test(userAgent)) return 'Windows'
  if (/Macintosh|Mac OS/.test(userAgent)) return 'Mac OS'
  if (/Android/.test(userAgent)) return 'Android'
  if (/iOS/.test(userAgent)) return 'iOS'
  if (/Linux/.test(userAgent)) return 'Linux'
  return 'Sistema operativo desconocido'
}

function getScreenResolution() {
  return `${window.screen.width}x${window.screen.height}`
}

function getBrowserInfo() {
  return navigator.userAgent
}

export default defineNuxtPlugin(() => {
  const logUserActivity = async (
    userId,
    actionType,
    actionResult,
    visitedUrl = null
  ) => {
    try {
      const api = useApi()
      if (!visitedUrl) {
        visitedUrl = window.location.href
      }
      const data = {
        userId,
        actionType,
        actionResult,
        sessionId: 'FALLO GETCOOKIE',
        visitedUrl,
        deviceInfo: {
          deviceType: getDeviceType(),
          os: getOperatingSystem(),
          resolution: getScreenResolution(),
          browserInfo: getBrowserInfo(),
        },
      }
      await api.post('/api/user-activity', data)
    } catch (error) {
      console.error('Error al registrar actividad:', error)
    }
  }

  return {
    provide: {
      logUserActivity,
    },
  }
})
