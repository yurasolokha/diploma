import { ApiResponseType } from './api-reponse-type.enum';

export class BaseApiResponse {
  responseType!: ApiResponseType;
  statusCode!: number;

  content?: any;

  path?: string;
  title?: string;
  timestamp?: Date;
  isSubmitted?: boolean;
  
  message?: string;
  
  isSuccess?: boolean;
}