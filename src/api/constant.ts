/* 系统常量 */

// api
export const SYS_API: string = '/sys'
export const ORDER_API: string = '/order'
export const FILE_API: string = '/file'
export const SELL_API: string = '/sell'

// 管理员id
export const ADMIN_ID: number = 1

// 是否
export const YES: number = 1
export const NO: number = 0

// session name
export const SESSION_USER_PERM: string = 'up'
export const SESSION_USER_INFO: string = 'u'
export const SESSION_TOKEN: string = 't'
export const SESSION_MENU: string = 'm'
export const SESSION_AES: string = 'a'

// actions
export const SET_USER_PERMS: string = 'setUserPerms'
export const SET_USER_INFOS: string = 'setUserInfos'

// store module
export const THEME_CONFIG_MODULE: string = 'themeConfig'
export const ROUTES_LIST_MODULE: string = 'routesList'
export const KEEP_ALIVE_NAMES_MODULE: string = 'keepAliveNames'
export const TAGS_VIEW_ROUTES_MODULE: string = 'tagsViewRoutes'
export const USER_INFOS_MODULE: string = 'userInfos'
export const USER_PERMS_MODULE: string = 'userPerms'
export const REQUEST_OLD_ROUTES_MODULE: string = 'requestOldRoutes'

// 文件
export const FILE_BUCKET: string = 'sys'
export const FILE_EXPIRY: number = 60
export const FILE_SERVER_URL: string = import.meta.env.VITE_IMAGE_URL as string