export class PaginationHelper {
    static buildPagination(
        query: { limit: number; offset: number },
        count: number,
    ) {
        const offset = +query.offset;
        const limit = +query.limit;

        return {
            nextOffset: offset + limit,
            nextPage: (offset + limit) / limit + 1,
            totalCount: count,
        };
    }
}
