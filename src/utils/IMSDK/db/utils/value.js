import { escapeString } from './escape';
import { isString } from './is';
import { convertSnakeCaseToCamelCase, convertCamelCaseToSnakeCase, } from './key';
export function converSqlExecResult(record, keyType = 'CamelCase', booleanKeys = [], convertMap = {}, option = {}) {
  //const { columns = [], values = [] } = record || {};
  const values = Array.isArray(record)? record :  [record];
  const result = [];
  if(undefined === record) return result;
  values.forEach(row => {
    const converted = {};
    const keys = Object.keys(row)
    keys.forEach((k,i) => {
      let ck = k;
      let cv = row[k];
      if (keyType === 'CamelCase') {
        ck = convertSnakeCaseToCamelCase(k);
      }
      if (keyType === 'SnakeCase') {
        ck = convertCamelCaseToSnakeCase(k);
      }
      if (booleanKeys.find(bk => bk === ck)) {
        cv = !!cv;
      }
      ck = convertMap[k] || ck;
      if (option.key && ck.includes(option.suffix)) {
        ck = ck.replace(option.suffix, '')
        if(!converted[option.key]){
          converted[option.key] = {}
        }
        converted[option.key][ck] = cv
        return
      }
      converted[ck] = cv;
    })
    result.push(converted);
  })
  return result;
}
export function convertToCamelCaseObject(obj) {
  const retObj = {};
  Object.keys(obj).forEach(k => {
    retObj[convertSnakeCaseToCamelCase(k)] = obj[k];
  });
  return retObj;
}
export function convertToSnakeCaseObject(obj, escape = true) {
  const retObj = {};
  Object.keys(obj).forEach(k => {
    let value = obj[k];
    if (escape && isString(value)) {
      value = escapeString(value).slice(1, -1);
    }
    retObj[convertCamelCaseToSnakeCase(k)] = value;
  });
  return retObj;
}
export function convertObjectField(obj, convertMap = {}) {
  const ret = {};
  Object.keys(obj).forEach(k => {
    const nk = convertMap[k] || k;
    ret[nk] = obj[k];
  });
  return ret;
}

export const formatData = (data) => {
  let formatObj = (obj) => {
    for(let key in obj) {
      if(typeof obj[key] === 'string' && obj[key].includes(`'`)) {
        obj[key] = obj[key].replaceAll("'", `\'\'`)
      }
    }
  }
  if(Array.isArray(data)) {
    data.forEach(item => {
      formatObj(item)
    })
  } else {
    formatObj(data)
  }
}
