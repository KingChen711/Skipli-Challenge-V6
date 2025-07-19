export class PagedList<T> {
  public pageNumber: number
  public pageSize: number
  public totalPages: number
  public totalCount: number
  public items: T[]
  public hasPrevious: boolean
  public hasNext: boolean

  constructor(items: T[], count: number, pageNumber: number, pageSize: number) {
    this.items = items
    this.totalCount = count
    this.pageNumber = pageNumber
    this.pageSize = pageSize
    this.totalPages = Math.ceil(count / pageSize)
    this.hasPrevious = pageNumber > 1
    this.hasNext = pageNumber < this.totalPages
  }
}
