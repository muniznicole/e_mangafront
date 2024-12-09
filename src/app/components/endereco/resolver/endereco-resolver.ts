import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { Endereco } from "../../../models/endereco.model";
import { EnderecoService } from "../../../services/endereco.service";

export const enderecoResolver: ResolveFn<Observable<Endereco>> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Endereco> => {
        const id = route.paramMap.get('id');
        return inject(EnderecoService).findById(Number(id));
    }