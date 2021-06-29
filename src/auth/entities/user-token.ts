import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserToken{
    @Field()
    access_token: string;
}