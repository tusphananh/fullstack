// MutationResponse abstract class

import { ClassType, Field, ObjectType } from "type-graphql";

export function Response<TData>(TDataClass: ClassType<TData>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class ResponseClass {
    @Field()
    code: number;
    @Field()
    success: boolean;
    @Field({ nullable: true })
    message?: string;
    @Field(() => TDataClass, { nullable: true })
    data?: TData;
  }
  return ResponseClass;
}
