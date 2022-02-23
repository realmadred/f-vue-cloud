import { FILE_BUCKET, FILE_SERVER_URL } from '/@/api/constant';
import { SysDictDetail } from '/@/api/system/dict';
import { i18n } from '/@/i18n/index';

/* 1是 0否 */
export const yes: number = 1
export const no: number = 0

/**
 * 将boolean值转换为数字
 * @param bool 
 * @returns 0|1
 */
export const booleanToInt = (bool: boolean): number => {
   return bool ? yes : no
}

/**
 * 过滤树结构
 * @param list 
 * @param name 
 * @returns 过滤后的树
 */
export const recursionFilterTree = (list: Array<any>, name: string): Array<any> => {
   if (name) {
      const result: Array<any> = []
      for (const item of list) {
         if (item.title.includes(name)) {
            result.push(item)
            continue
         }

         // 过滤下级
         if (item.children && item.children.length) {
            const children = recursionFilterTree(item.children, name)
            if (children && children.length) {
               const node = Object.assign({}, item, { children: children })
               result.push(node)
            }
         }
      }
      return result;
   }
   return list
}

/**
 * 设置路由的国际化名称
 * @param routes 路由
 * @returns 国际化后路由
 */
export const setMenuTitle = (routes: any[]) => {
   const arr: any[] = [];
   routes.map((val: any) => {
      val['title'] = i18n.global.t(val.meta.title);
      arr.push({ ...val });
      if (val.children) {
         val.children = setMenuTitle(val.children);
      }
   });
   return arr;
};

/**
 * 获取最后一级的id
 * @param routes 路由
 * @returns 国际化后路由
 */
export const recursionLastLevelIds = (routes: any[]): number[] => {
   const arr: number[] = [];
   for (const route of routes) {
      if (route.children && route.children.length > 0) {
         arr.push(...recursionLastLevelIds(route.children))
      } else {
         arr.push(route.id)
      }
   }
   return arr;
};

/**
 * 字符串转 array buffer
 * @param str 字符串
 * @returns array buffer
 */
export function strToArrayBuffer(str: string) {
   const byteLength = str.length;
   const bytes = new Uint8Array(byteLength);
   for (let i = 0; i < byteLength; i++) {
      bytes[i] = str.charCodeAt(i);
   }
   return bytes.buffer;
}

/**
 * array buffer 转base64
 * @param buffer buffer
 * @returns base64
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
   let binaryStr = "";
   const bytes = new Uint8Array(buffer);
   for (let i = 0, len = bytes.byteLength; i < len; i++) {
      binaryStr += String.fromCharCode(bytes[i]);
   }
   return window.btoa(binaryStr);
}

/**
 * 获取字典名称
 * @param dict 字典
 * @param value 字典值
 * @returns 字典名称
 */
export function getDictName(dict: SysDictDetail[], value: string): string {
   if (value && dict && dict.length) {
      const name = dict.find(d => d.value === value)?.name
      if (name) {
         return name
      }
   }
   return ''
}

/**
 * 获取文件后缀
 * @param fileName 文件名
 * @returns 后缀
 */
export function getSuffix(fileName: string): string {
   if (fileName) {
      return fileName.substring(fileName.lastIndexOf('.') - 1)
   }
   return ''
}

/**
 * 获取文件路径
 * http://192.168.137.7:9000/sys/632efa4f59aa57d7c9e88999d27271f5S.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&
 * X-Amz-Credential=sysAdminService%2F20220223%2Fzh-feng%2Fs3%2Faws4_request&X-Amz-Date=20220223T062324Z&
 * X-Amz-Expires=60&X-Amz-SignedHeaders=host&
 * X-Amz-Signature=c146dc2968b0810256151550c85af6bc6243755299b68c1cba59edf582575945
 * @param url url
 * @returns 文件路径
 */
export function getPath(url: string): string {
   if (url) {
      return url.substring(url.indexOf('/' + FILE_BUCKET + '/'), url.indexOf('?'))
   }
   return ''
}

/**
 * 获取文件src
 * /sys/632efa4f59aa57d7c9e88999d27271f5S.jpg > http://192.168.137.7:9000/sys/632efa4f59aa57d7c9e88999d27271f5S.jpg
 * http://192.168.137.7:9000/sys/632efa4f59aa57d7c9e88999d27271f5S.jpg > http://192.168.137.7:9000/sys/632efa4f59aa57d7c9e88999d27271f5S.jpg
 * 
 * @param path 路径
 * @returns 文件src
 */
export function getSrc(path: string): string {
   if (path) {
      if (path.startsWith('http')) {
         return path
      }
      return FILE_SERVER_URL + path
   }
   return ''
}