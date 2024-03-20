import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Gif, SearchGifsResponse } from 'src/interfaces/gifs.interface';

const URL = environment.url_server;
const APIKEY = environment.api_key;

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  resultados:Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient) { 

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string = '') {

    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {

      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    

    const params = new HttpParams()
      .set('api_key', APIKEY)
      .set('limit', 20)
      .set('q',query);

    this.http.get<SearchGifsResponse>(`${URL}`,{params}).subscribe(
      (res: SearchGifsResponse) => {

        this.resultados = res.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      },
      (error) => {
        console.error('Error al buscar GIFs:', error);
      }
    );
  }
}
