import { ApiErrorResponse } from './http';
import _ from "lodash"

export const getErrorMessage = (err: ApiErrorResponse, defaultError: string) => {
  if (_.isArray(err?.response?.data?.message)) {
    return _.get(err?.response?.data, "message[0]", defaultError);
  } else {
    return _.get(err?.response?.data, "message", defaultError);
  }
}

