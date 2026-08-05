import { createPermissionMiddleware } from '~/utils/permission-middleware'

export default createPermissionMiddleware(['pagosDobles.read', 'pagosDobles.update'])
