/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from "pocketbase";
import type { RecordService } from "pocketbase";

export enum Collections {
  Messages = "messages",
  Topics = "topics",
  Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString;
  created: IsoDateString;
  updated: IsoDateString;
  collectionId: string;
  collectionName: Collections;
  expand?: T;
};

export type AuthSystemFields<T = never> = {
  email: string;
  emailVisibility: boolean;
  username: string;
  verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type MessagesRecord = {
  content: string;
  topicId: RecordIdString;
  userId: RecordIdString;
};

export type TopicsRecord = {
  capacity?: number;
  category?: string;
  creator?: RecordIdString;
  description?: string;
  expired?: IsoDateString;
  image?: string;
  members?: RecordIdString[];
  name: string;
};

export type UsersRecord = {
  avatar?: string;
  name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type MessagesResponse<Texpand = unknown> = Required<MessagesRecord> & BaseSystemFields<Texpand>;
export type TopicsResponse<Texpand = any> = Required<TopicsRecord> & BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  messages: MessagesRecord;
  topics: TopicsRecord;
  users: UsersRecord;
};

export type CollectionResponses = {
  messages: MessagesResponse;
  topics: TopicsResponse;
  users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: "messages"): RecordService<MessagesResponse>;
  collection(idOrName: "topics"): RecordService<TopicsResponse>;
  collection(idOrName: "users"): RecordService<UsersResponse>;
};
