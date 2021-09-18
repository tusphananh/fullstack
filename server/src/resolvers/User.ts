import User from "../entities/User";
import { Resolver, Arg, Mutation } from "type-graphql";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
  /**
   * Register a new user
   */

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string
  ): Promise<User | null> {
    try {
      // Check existing user then create new user
      const user = await User.findOne({ username });
      if (user) {
        return null;
      }

      // hash password with argon2
      const hashedPassword = await argon2.hash(password);
      const newUser = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
      }).save();

      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Login for user
   */
}
