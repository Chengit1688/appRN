import dayjs from 'dayjs';
import {floor} from 'lodash-es';

export function formatTime(timestamp: number, format: string) {
  return dayjs(timestamp).format(format);
}

export function formatFileSize(size: number) {
  if (!size) {
    return;
  }
  let value = size / 1024 ** 2;
  let unit = 'K';
  if (value > 1) {
    unit = 'M';
  } else {
    value = size / 1024;
    if (value < 1) {
      unit = '';
      value = size;
    }
  }
  return floor(value, 2) + unit;
}
