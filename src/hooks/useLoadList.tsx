import {usePagination} from 'ahooks';
import {useState} from 'react';

export default function useLoadList(getList: any, options?: any) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const servers = ({
    page = 1,
    page_size = 20,
  }: {
    page: number;
    page_size: number;
  }): Promise<{total: number; list: any[]}> => {
    return new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const res = await getList({page, page_size});
        const dataList = res?.list || res?.data || [];
        if (page === 1) {
          setList(dataList);
        } else {
          setList(list.concat(dataList));
        }
        setLoading(false);
        resolve({total: res.count || 0, list: dataList});
      } catch (error) {
        setLoading(false);
        reject(error);
      }
    });
  };

  const clear = () => {
    setList([]);
  };
  const {data, pagination} = usePagination(servers, options);

  return {
    loading,
    list,
    pagination,
    haveMore: data?.total > list.length,
    clear,
    setList,
  };
}
