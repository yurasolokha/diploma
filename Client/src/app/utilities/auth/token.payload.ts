export class TokenPayload 
{
    private notBefore: Date;
    private expiration: Date;
    private issuer: string;
    private audience: string;
    private clientId: string;
    private userId: string;
    private authenticatedAt: Date;
    private identityProvider: string;
    private role: string;
    private username: string;
    private email: string;
    private firstName!: string;
    private scope: Array<string>;
    private authenticationMethodReference: Array<string>;

    constructor(decodedTokenPayload: any) 
    {
        this.notBefore = new Date(decodedTokenPayload.nbf * 1000);
        this.expiration = new Date(decodedTokenPayload.exp * 1000);
        this.issuer = decodedTokenPayload.iss;
        this.audience = decodedTokenPayload.aud;
        this.clientId = decodedTokenPayload.client_id;
        this.userId = decodedTokenPayload.sub;
        this.authenticatedAt = new Date(decodedTokenPayload.auth_time * 1000);
        this.identityProvider = decodedTokenPayload.idp;
        this.role = decodedTokenPayload.role;
        this.username = decodedTokenPayload.name;
        this.email = decodedTokenPayload.email;
        this.scope = decodedTokenPayload.scope;
        this.authenticationMethodReference = decodedTokenPayload.amr;
    }

    getExpirationDate(): Date {
        return this.expiration;
    }

    getUserId(): string {
        return this.userId;
    }

    getRole(): string {
        return this.role;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }
}