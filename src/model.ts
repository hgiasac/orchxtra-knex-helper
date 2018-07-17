import { IHistoryMeta, UpdateAction } from "./history";
import { StatusCode} from "./util";

export interface IBaseModel {
  createdAt: Date;
  updatedAt: Date;
  history: IHistoryMeta;
  status: StatusCode;
}

export interface IUpdateOptions {
  updatedBy: string;
  note?: string;
  action?: UpdateAction;
}

export interface IFileModelInput {
  subjectId: string;
  name: string;
  description?: string;
  fileName: string;
  fileData: string;
  fileExtension: string;
}

export interface IFileModel extends IFileModelInput, IBaseModel {
  id: string;
  status: StatusCode;
}
