export interface IsOpen {
  /** 1开 2关 **/
  is_open : 1 | 2
}

export interface Announcement extends IsOpen {
  start: string,
  end: string,
  title: string,
  content: string
}

export interface DiscoverListItem {
  id: number,
  name: string,
  icon: string,
  sort: number,
  url: string
}

export interface Discover extends IsOpen {
  list:DiscoverListItem[]
}