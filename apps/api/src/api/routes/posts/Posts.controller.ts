import debug from "debug";
import { Request, Response } from "express";
import Services from "../../../Services";
import { PostsModel } from "@dodgeball/mongodb";

const LOG = debug("dodgeball:api:routes:posts:Posts.controller");

export default class PostsController {
  private service: Services;

  constructor(service: Services) {
    this.service = service;
  }

  async getPosts(req: Request, res: Response) {
    LOG(`Getting posts`);
    // We will assume we have a query, if not we default to home
    const { category, page } = req.query;
    let query: any = {};
    if (category) {
      query = {
        ...query,
        category: category as string
      };
    } else {
      query = {
        ...query,
        homePrint: true
      };
    }
    const posts = await PostsModel.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .skip(page ? parseInt(page as string) * 5 : 0);

    const count = await PostsModel.countDocuments(query);

    const totalPages = Math.ceil(count / 5);
    const currentPage = page ? parseInt(page as string) : 0;

    LOG(`Got posts ${posts.length}`);

    return res.status(200).json({
      posts,
      totalPages,
      currentPage
    });
  }
}
