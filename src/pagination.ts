import * as Knex from "knex";
import { safeParseInt } from "./util";

export interface IPagingParams {
  page?: string | number;
  pageSize?: string | number | boolean;
  orderBy?: string[][];
}

export interface IPaginationInfo {
  page: number;
  pageSize: number;
  total: number;
}

export interface IPagingResult<T> {
  data: T[];
  pagination: IPaginationInfo;
}

export interface IErrorModel {
  code?: string;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  errors: IErrorModel[];
}

export enum UserStatusErrorCode {
  NotFound = "not_found",
  Inactive = "user_inactive",
  Disabled = "user_disabled",
  Deleted = "user_deleted"
}

export function applyOrder(
  query: Knex.QueryBuilder, orderBy: string[][]): Knex.QueryBuilder {

  return orderBy && orderBy.length > 0 ?
    orderBy.reduce((qur, ord) =>
      qur.orderBy(ord[0], ord[1] || "asc") , query) : query;
}

export async function filterPagination<T = any>(
  table: string | {
    tableName: string;
    idColumn: string;
    selectColumns: string[]
  },
  query: Knex.QueryBuilder,
  pagingParams?: IPagingParams,

): Promise<IPagingResult<T>> {

  const { tableName, idColumn, selectColumns } =
    typeof table === "string"
    ? { tableName: table, idColumn: "id", selectColumns: null }
    : table;

  const page = (pagingParams && pagingParams.page) ? safeParseInt(pagingParams.page) : 1;
  const options = {
    orderBy: [
      [ idColumn, "DESC"]
    ],
    offset: 0,
    ...pagingParams,
    page: page > 1 ? page : 1,
    limit: (pagingParams && pagingParams.pageSize) ? safeParseInt(<string> pagingParams.pageSize) : 0,
  };

  let results = [];
  let count = 0;

  if (!options.limit) {

    results = await applyOrder(query, options.orderBy);
    count = results.length;
  } else {
    options.offset = options.offset || ((options.page - 1) * options.limit);

    count = await query
      .clone()
      .count(`${tableName}.${idColumn}`)
      .then((result: any[]) =>
        result.length ? parseInt(result[0].count, 10) : 0);

    if (count <= options.offset) {
      return {
        data: [],
        pagination: {
          page: options.page,
          pageSize: options.limit,
          total: count,
        }
      };
    }

    if (selectColumns && selectColumns.length) {
      query = query.select(selectColumns);
    }

    results = await applyOrder(query
      .offset(options.offset)
      .limit(options.limit), options.orderBy);

  }

  return {
    data: results,
    pagination: {
      page: options.page,
      pageSize: options.limit,
      total: count,
    }
  };
}
