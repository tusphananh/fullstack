import User from "../entities/User";
import { Resolver, Arg, Mutation, Query, Ctx } from "type-graphql";
import argon2 from "argon2";
import { UserResponse } from "../types/UserResponse";
import { isPhoneNumber } from "../utils/PhoneValidator";
import { Context } from "../types/Context";
import { SESSION_COOKIE_NAME } from "../constants/CookieConstants";

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
    @Arg("lastName") lastName: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse | null> {
    try {
      if (!isPhoneNumber(phone)) {
        return {
          code: 400,
          success: false,
          message: "Invalid phone number",
        };
      }

      // Check existing user then create new user
      const user = await User.findOne({ phone: phone });
      if (user) {
        const rs = {
          code: 400,
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
        code: 200,
        success: true,
        message: "Successfully",
        data: newUser,
      };

      // Create session
      req.session.userId = rs.data.id;

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
    @Arg("password") password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse | null> {
    try {
      if (!isPhoneNumber(phone)) {
        return {
          code: 400,
          success: false,
          message: "Invalid phone number form",
        };
      }

      const user = await User.findOne({ phone: phone });
      if (!user) {
        return {
          code: 400,
          success: false,
          message: "Phone number not found",
        };
      }

      const isValid = await argon2.verify(user.password, password);
      if (!isValid) {
        return {
          code: 400,
          success: false,
          message: "Wrong password",
        };
      }

      // Create Successful Login response
      const rs = {
        code: 200,
        success: true,
        message: "Successfully",
        data: user,
      };

      // Create session
      req.session.userId = rs.data.id;

      return rs;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Logout for user by Query
   */
  @Query(() => UserResponse, { nullable: true })
  async logout(@Ctx() { req, res }: Context): Promise<UserResponse | null> {
    try {
      // Delete session
      res.clearCookie(SESSION_COOKIE_NAME);
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return {
            code: 400,
            success: false,
            message: "Internal Error",
          };
        }
        return;
      });

      return {
        code: 200,
        success: true,
        message: "Successfully Logout",
      };
    } catch (error) {
      console.log(error);
      return {
        code: 400,
        success: false,
        message: "Internal Error",
      };
    }
  }
}
