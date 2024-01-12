import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    }
  });
}

export function arrayToTree(data: any[], key: string, parentId: string) {
  const result: any = []; // 存放结果集
  const itemMap: any = {}; //

  for (const item of data) {
    const id = item[key];
    const pid = item[parentId];

    if (!itemMap[id]) {
      itemMap[id] = { ...item, children: [] };
    }

    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      itemMap[pid].children.push(treeItem);
    }
  }

  return result;
}
