import { Injectable } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { map } from "rxjs";

@Injectable({providedIn: "root"})
export class QueryHelper {
    private _params: Params = {}

    constructor(private router: Router, private route: ActivatedRoute) {
        route.queryParams.subscribe(e => {
            this._params = e;
        })
    }
    
    get params(): Params {
        return this._params;
    }

    public setQueryParams(params: Params, resetParams: boolean = false) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: resetParams ? "preserve" : "merge",
            replaceUrl: true
        });
    }

    public getQueryMapped<T>(mapper: (params: Params) => T) {
        return this.route.queryParams.pipe(map(mapper));
    }
}