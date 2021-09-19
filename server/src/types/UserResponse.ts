// Class UserMutationResponse implements MutationResponse

import User from "../entities/User";
import { ObjectType } from "type-graphql";
import { Response } from "./Response";

@ObjectType()
export class UserResponse extends Response(User) {
  code: number;
  success: boolean;
  message: string;
  data?: User;
}
