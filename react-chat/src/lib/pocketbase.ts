import PocketBase from "pocketbase";
import { SERVER_URL } from "./constants";
// import { TypedPocketBase } from "./types/pocketbase-types";
export const pb = new PocketBase(SERVER_URL); //
