import { safeParseJSON } from "./util";

export enum UpdateAction {
  Create = "create",
  Update = "update",
  Delete = "delete",
  Rollback = "rollback",
}

export interface IUpdateHistory {
  note?: string;
  action: UpdateAction;
  data: any;
  updatedBy: string;
  updatedAt?: string;
  rollbacked?: boolean;
}

export interface IHistoryMeta {
  histories: IUpdateHistory[];
}

export function HistoryMeta(meta?: IHistoryMeta): IHistoryMeta {
  return {
    histories: [],
    ...meta,
  };
}

export function appendUpdateHistory(
  history: string | IHistoryMeta, form: IUpdateHistory): IHistoryMeta {

  const old = HistoryMeta(safeParseJSON(history, {}));

  const historyObj: IUpdateHistory = {
    note: "",
    rollbacked: false,
    ...form,
    updatedAt: new Date().toISOString(),
  };

  return {
    ...old,
    histories: old.histories.concat([historyObj]),
  };
}
