import { createPermissionMiddleware } from '~/utils/permission-middleware'

export default createPermissionMiddleware(['system.config.admin'])
