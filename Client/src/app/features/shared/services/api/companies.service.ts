import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractRestService } from 'src/app/utilities/services/abstract-rest.service';
import { CompanyModel } from '../../models/company.model';

@Injectable({providedIn: 'root'})
export class CompaniesService extends AbstractRestService {

  constructor(protected override http: HttpClient){ super(http); }

  public createCompany(company: CompanyModel) {
    return this.putItem('companies/create-company', company);
  }

  public updateCompany(company: CompanyModel) {
    return this.postItem('companies/update-company', company);
  }

  public deleteCompany(company: CompanyModel) {
    return this.delete('companies/delete-company', company.id!);
  }

  public getCompanies() {
    return this.get('companies/companies');
  }
}