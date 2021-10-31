/// <reference types="@adonisjs/ally" />
/// <reference types="@adonisjs/http-server/build/adonis-typings" />
import type { AllyUserContract, LiteralStringUnion } from '@ioc:Adonis/Addons/Ally';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone';
export declare type GitlabAccessToken = {
    token: string;
    type: 'bearer';
};
/**
 * Available Gitlab scopes
 *
 * @link https://docs.gitlab.com/ee/integration/oauth_provider.html#authorized-applications
 */
export declare type GitlabScopes = 'api' | 'read_user' | 'read_api' | 'read_repository' | 'write_repository' | 'read_registry' | 'write_registry' | 'sudo' | 'openid' | 'profile' | 'email';
export declare type GitlabDriverConfig = {
    driver: 'gitlab';
    gitlabUrl?: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authorizeUrl?: string;
    accessTokenUrl?: string;
    userInfoUrl?: string;
    scopes?: LiteralStringUnion<GitlabScopes>[];
};
/**
 * Gitlab driver to login user via Gitlab
 */
export declare class GitlabDriver extends Oauth2Driver<GitlabAccessToken, GitlabScopes> {
    config: GitlabDriverConfig;
    protected authorizeUrl: string;
    protected accessTokenUrl: string;
    protected userInfoUrl: string;
    protected codeParamName: string;
    protected errorParamName: string;
    protected stateCookieName: string;
    protected stateParamName: string;
    protected scopeParamName: string;
    protected scopesSeparator: string;
    constructor(ctx: HttpContextContract, config: GitlabDriverConfig);
    protected configureRedirectRequest(request: RedirectRequest<GitlabScopes>): void;
    accessDenied(): boolean;
    user(callback?: (request: ApiRequest) => void): Promise<AllyUserContract<GitlabAccessToken>>;
    userFromToken(accessToken: string, callback?: (request: ApiRequest) => void): Promise<AllyUserContract<{
        token: string;
        type: 'bearer';
    }>>;
    protected getAuthenticatedRequest(token: string): ApiRequest;
    /**
     * Fetches the user info from the Gitlab API
     * https://docs.gitlab.com/ee/api/users.html#list-current-user-for-normal-users
     */
    protected getUserInfo(token: string, callback?: (request: ApiRequest) => void): Promise<Omit<AllyUserContract<GitlabAccessToken>, 'token'>>;
}
