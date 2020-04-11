import { Component, OnInit } from '@angular/core';
import { PokeapiService } from 'src/app/services/pokeapi.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  nameFilter = '';
  selectedPkm = null;

  get pokemonList() {
    return this.pokeapi.pokemonList.filter(pokemon => {
      return pokemon.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) !== -1;
    })
  }

  get pkmSprite() {
    const number = ("000" + this.selectedPkm.number).slice(-3);
    return `//assets.pokemon.com/assets/cms2/img/pokedex/detail/${number}.png`;
  }



  constructor(
    private pokeapi: PokeapiService,
    private dialog: MatDialog
  ) { }

  open() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = this.selectedPkm;
    dialogConfig.hasBackdrop = true
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.dialog.open(ModalComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.pokeapi.fetchPokemons();
  }

  async getPkmType(number: number) {
    const data = await this.pokeapi.fetchPokemonType(number);
    return data.types.map((t: any) => t.type.name);
  }

  async selectPokemon(pkm) {
    const types = await this.getPkmType(pkm.number);
    this.selectedPkm = { ...pkm, types };

    this.open();
  }
}
