import { createPermissionMiddleware } from '~/utils/permission-middleware'

export default createPermissionMiddleware(['cementerio.read', 'cementerio.update', 'cementerio.admin'])
