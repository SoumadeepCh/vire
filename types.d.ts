/* eslint-disable no-var */
import { Connection } from "mongoose";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  },
  var ContextWithId = {
		params: { id: string },
  };
}

export {};
