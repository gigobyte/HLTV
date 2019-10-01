import { Player } from "./Player";
import { Country } from "./Country";
import { Team } from "./Team";

export interface SearchPlayer extends Player {
  readonly ign: string
  readonly image: string
  readonly country: Country
  readonly team: Team
}
