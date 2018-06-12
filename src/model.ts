import { IHistoryMeta } from "./history";
import { StatusCode} from "./util";

export interface IBaseModel {
  createdAt: Date;
  updatedAt: Date;
  history: IHistoryMeta;
  status: StatusCode;
}

export interface IUpdateOptions {
  updatedBy: string;
}
