import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SimpleFormDialog } from 'src/app/features/shared/dialog-models/simple-form.dialog';
import { CompanyModel } from 'src/app/features/shared/models/company.model';
import { RoleModel } from 'src/app/features/shared/models/role.model';
import { UserFullNamePipe } from 'src/app/features/shared/pipes/full-name.pipe';
import { PasswordValidators } from 'src/app/features/shared/validators/password.validator';
import { ServerSideValidators } from 'src/app/features/shared/validators/server-side.validator';
import { Guid } from 'src/app/utilities/types/guid';
import { UsersService } from '../../services/users.service';

@Component({
  templateUrl: './create-update-user.component.html',
  styleUrls: ['./create-update-user.component.scss'],
})
export class CreateUpdateUserComponent
  extends SimpleFormDialog
  implements OnInit
{
  public readonly roles: RoleModel[];
  public readonly companies: CompanyModel[];

  constructor(
    dialog: MatDialogRef<CreateUpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    fullNamePipe: UserFullNamePipe,
    private usersService: UsersService
  ) {
    super(
      !data.user
        ? {
            isUpdate: false,
            headerCaption: 'Register New User',
            initForm: () => this.initEmptyForm(),
          }
        : {
            isUpdate: true,
            headerCaption: 'Update User ' + fullNamePipe.transform(data.user),
            initForm: () =>
              this.initFormFromData(data.user, this.companies, this.roles),
          },
      dialog
    );

    this.roles = data.roles;
    this.companies = data.companies;
  }

  ngOnInit(): void {
    this.model.initForm();
  }

  InputValidation(formControlName: string): boolean {
    const inputValue = this.form.controls[formControlName];

    return inputValue.invalid && inputValue.dirty;
  }

  containeValidationError(formControlName: string, errorName: string) {
    const inputValue = this.form.controls[formControlName];

    return inputValue.hasError(errorName);
  }

  private initEmptyForm() {
    this.form = new FormGroup(
      {
        id: new FormControl(Guid.newGuid()),
        name: new FormControl(
          undefined,
          [Validators.required],
          [
            ServerSideValidators.createServerValidator(
              this.usersService.isUserNotRegistered,
              { requstFailed: true },
              { userNameAlreadyInUse: true }
            ),
          ]
        ),
        email: new FormControl(
          undefined,
          [Validators.required, Validators.email],
          [
            ServerSideValidators.createServerValidator(
              this.usersService.isEmailNotRegistered,
              { requstFailed: true },
              { emailAlreadyInUse: true }
            ),
          ]
        ),
        firstName: new FormControl(undefined, [Validators.required]),
        middleName: new FormControl(undefined),
        lastName: new FormControl(undefined, [Validators.required]),
        password: new FormControl(undefined, [
          Validators.required,
          Validators.minLength(8),
          PasswordValidators.patternValidator(/(?=.*[0-9])/, {
            requiresDigit: true,
          }),
          PasswordValidators.patternValidator(/(?=.*[A-Z])/, {
            requiresUppercase: true,
          }),
          PasswordValidators.patternValidator(/(?=.*[a-z])/, {
            requiresLowercase: true,
          }),
        ]),
        repeatPassword: new FormControl(undefined, [
          Validators.required,
          Validators.minLength(8),
        ]),
        company: new FormControl(undefined, [Validators.required]),
        role: new FormControl(undefined, [Validators.required]),
      },
      {
        validators: [
          PasswordValidators.matchValidator('password', 'repeatPassword'),
        ],
      }
    );
  }

  private initFormFromData(
    user: any,
    companies: CompanyModel[],
    roles: RoleModel[]
  ) {
    this.form = new FormGroup({
      id: new FormControl(user.id),
      name: new FormControl(user.userName, [Validators.required]),
      email: new FormControl(user.email, [
        Validators.required,
        Validators.email,
      ]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      middleName: new FormControl(user.middleName),
      lastName: new FormControl(user.lastName, [Validators.required]),
      password: new FormControl(undefined, [Validators.minLength(8),
        PasswordValidators.patternValidator(/(?=.*[0-9])/, {
          requiresDigit: true,
        }),
        PasswordValidators.patternValidator(/(?=.*[A-Z])/, {
          requiresUppercase: true,
        }),
        PasswordValidators.patternValidator(/(?=.*[a-z])/, {
          requiresLowercase: true,
        }),]),
      repeatPassword: new FormControl(undefined, [Validators.minLength(8)]),
      company: new FormControl(
        companies.find((e) => e.id === user.company.id),
        [Validators.required]
      ),
      role: new FormControl(
        roles.find((e) => e.id === user.roles[0].id),
        [Validators.required]
      ),
    }, {
      validators: [
        PasswordValidators.matchValidator('password', 'repeatPassword'),
      ],
    });
  }
}
