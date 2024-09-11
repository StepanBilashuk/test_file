export class BaseResponsePaginationDto {
  readonly nextOffset: number;
  readonly nextPage: number;
  readonly totalCount: number;

  constructor(pagination) {
    this.nextOffset = +pagination.nextOffset;
    this.nextPage = +pagination.nextPage;
    this.totalCount = +pagination.totalCount;
  }
}
