import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface Pokemon {
  name: string,
  url: string,
  number: number
  types: string[]
}
interface PokemonListResponse {
  count: number,
  next: string,
  previous: string,
  results: any[],
  resource_uri: string
}


@Injectable({
  providedIn: 'root'
})
export class PokeapiService {

  private url = 'https://pokeapi.co/api/v2/pokemon';
  pokemonList: Pokemon[] = [];
  pokemonTypes: string[] = [];

  constructor(
    private http: HttpClient
  ) { }

  fetchPokemons() {
    this.http.get<PokemonListResponse>(`${this.url}/?limit=20&offset=0`)
      .subscribe(
        response => {
          response.results.forEach(pokemon => {
            pokemon.number = this.getNumberFromUrl(pokemon.url)
          })
          this.pokemonList = this.sortPokemon(response.results)
            .filter(pokemon => pokemon.number < 1000)
        }
      )
  }

  fetchPokemonType(pokemonNumber: number) {
    return this.http.get<any>(`${this.url}/${pokemonNumber}`).toPromise();
    /*  this.pokemonTypes = data.types.map(t => t.type.name);
     return data.types.map(t => t.type.name) */
  }

  private getNumberFromUrl(url: string) {
    return parseInt(url.replace(/.*\/(\d+)\/$/, '$1'));
  }

  private sortPokemon(pokemonList: Pokemon[]) {
    return pokemonList.sort((a, b) => {
      return (a.number > b.number ? 1 : -1);
    })
  }
}
