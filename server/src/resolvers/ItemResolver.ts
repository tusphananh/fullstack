import Item from "../entities/Item";
import { Resolver, Arg, Mutation, Query } from "type-graphql";

@Resolver()
export class ItemResolver {
  /**
   * Add Items to the database by the user
   */

  @Mutation(() => Item, { nullable: true })
  async addItem(
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Arg("price") price: number,
    @Arg("imageUrl") imageUrl: string,
    @Arg("userId") userId: number
  ): Promise<Item | null> {
    try {
      const item = await Item.create({
        name,
        description,
        price,
        imageUrl,
        userId,
      }).save();
      return item;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Get all items from the database
   * @param userId
   */

  @Query(() => [Item])
  async getItems(@Arg("userId") userId: number): Promise<Item[]> {
    try {
      const items = await Item.find({
        userId,
      });
      return items;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
