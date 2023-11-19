import { ErrorBase } from "../../../utils/errorBase";

// TODO: Configure errors

export enum CreateMonitorErrorTypes {
  INVALID_URL = "INVALID_URL",
  INVALID_PROJECT = "INVALID_PROJECT",
  INVALID_AGENCY = "INVALID_AGENCY",
}

export class CreateMonitorError extends ErrorBase<CreateMonitorErrorTypes> {}