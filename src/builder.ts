import * as Knex from "knex";

export function dateRangeQuery(
  query: Knex.QueryBuilder,
  columnName: string,
  start: string | Date,
  end: string | Date): Knex.QueryBuilder {

  let result = query;
  if (!start && !end) {
    return result;
  }

  if (start && end) {
    result = start === end
      ? query.andWhere(columnName, start)
      : query.andWhereBetween(columnName, [
        start,
        end,
      ]);
  } else if (start) {
    result = query.andWhere(columnName, ">=", start);
  } else {
    result = query.andWhere(columnName, "<=", end);
  }

  return result;
}
