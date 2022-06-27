import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :title", { title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(title) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const usersRepository = getRepository(User);

    return await usersRepository
      .createQueryBuilder("users")
      .leftJoin("users_games_games", "ugg", "ugg.usersId = users.id")
      .leftJoin("games", "g", "g.id = ugg.gamesId")
      .select("users")
      .where("g.id = :game_id", { game_id: id })
      .getMany();
  }
}
