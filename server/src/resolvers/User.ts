import User from "../entities/User";
import { Resolver, Arg, Mutation, Query } from "type-graphql";
import argon2 from "argon2";
import { UserResponse } from "../types/UserResponse";
import { isPhoneNumber } from "../utils/PhoneValidator";
import {
  EXISTING_PHONE_NUMBER_CODE,
  INVALID_PHONE_NUMBER_CODE,
  NON_EXISTING_PHONE_NUMBER_CODE,
  SUCCESS_LOGIN_CODE,
  SUCCESS_REGISTER_CODE,
  WRONG_PASSWORD_CODE,
} from "../constants/User";

@Resolver()
export class UserResolver {
  /**
   * Register a new user
   */

  @Mutation(() => UserResponse, { nullable: true })
  async register(
    @Arg("phone") phone: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string
  ): Promise<UserResponse | null> {
    try {
      if (!isPhoneNumber(phone)) {
        return {
          code: INVALID_PHONE_NUMBER_CODE,
          success: false,
          message: "Invalid phone number",
        };
      }

      // Check existing user then create new user
      const user = await User.findOne({ phone: phone });
      if (user) {
        const rs = {
          code: EXISTING_PHONE_NUMBER_CODE,
          success: false,
          message: "Phone already exists",
        };

        return rs;
      }

      // hash password with argon2
      const hashedPassword = await argon2.hash(password);
      const newUser = await User.create({
        phone: phone,
        password: hashedPassword,
        firstName,
        lastName,
      }).save();

      const rs = {
        code: SUCCESS_REGISTER_CODE,
        success: true,
        message: "Successfully",
        data: newUser,
      };

      return rs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Login for user by Query
   */

  @Query(() => UserResponse, { nullable: true })
  async login(
    @Arg("phone") phone: string,
    @Arg("password") password: string
  ): Promise<UserResponse | null> {
    try {
      if (!isPhoneNumber(phone)) {
        return {
          code: INVALID_PHONE_NUMBER_CODE,
          success: false,
          message: "Invalid phone number form",
        };
      }

      const user = await User.findOne({ phone: phone });
      if (!user) {
        return {
          code: NON_EXISTING_PHONE_NUMBER_CODE,
          success: false,
          message: "Phone number not found",
        };
      }

      const isValid = await argon2.verify(user.password, password);
      if (!isValid) {
        return {
          code: WRONG_PASSWORD_CODE,
          success: false,
          message: "Wrong password",
        };
      }

      const rs = {
        code: SUCCESS_LOGIN_CODE,
        success: true,
        message: "Successfully",
        data: user,
      };

      return rs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
