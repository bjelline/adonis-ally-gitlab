"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabDriver = void 0;
const standalone_1 = require("@adonisjs/ally/build/standalone");
/**
 * Gitlab driver to login user via Gitlab
 */
class GitlabDriver extends standalone_1.Oauth2Driver {
    constructor(ctx, config) {
        super(ctx, config);
        this.config = config;
        this.authorizeUrl = 'https://gitlab.com/oauth/authorize';
        this.accessTokenUrl = 'https://gitlab.com/oauth/token';
        this.userInfoUrl = 'https://gitlab.com/api/v4/user';
        this.codeParamName = 'code';
        this.errorParamName = 'error';
        this.stateCookieName = 'gitlab_oauth_state';
        this.stateParamName = 'state';
        this.scopeParamName = 'scope';
        this.scopesSeparator = '+';
        if (config.gitlabUrl) {
            this.authorizeUrl = config.gitlabUrl + 'oauth/authorize';
            this.accessTokenUrl = config.gitlabUrl + 'oauth/token';
            this.userInfoUrl = config.gitlabUrl + 'api/v4/user';
        }
        this.loadState();
    }
    configureRedirectRequest(request) {
        request.scopes(this.config.scopes || ['read_user']);
        request.param('state', this.stateCookieValue);
        request.param('response_type', 'code');
    }
    accessDenied() {
        return this.ctx.request.input('error') === 'user_denied';
    }
    async user(callback) {
        const accessToken = await this.accessToken();
        const user = await this.getUserInfo(accessToken.token, callback);
        return {
            ...user,
            token: accessToken,
        };
    }
    async userFromToken(accessToken, callback) {
        const user = await this.getUserInfo(accessToken, callback);
        return {
            ...user,
            token: {
                token: accessToken,
                type: 'bearer',
            },
        };
    }
    getAuthenticatedRequest(token) {
        const request = this.httpClient(this.config.userInfoUrl || this.userInfoUrl);
        request.header('Accept', 'application/json');
        request.header('Authorization', `Bearer ${token}`);
        request.param('format', 'json');
        request.parseAs('json');
        return request;
    }
    /**
     * Fetches the user info from the Gitlab API
     * https://docs.gitlab.com/ee/api/users.html#list-current-user-for-normal-users
     */
    async getUserInfo(token, callback) {
        const request = this.getAuthenticatedRequest(token);
        if (typeof callback === 'function') {
            callback(request);
        }
        const body = await request.get();
        return {
            id: body.id,
            nickName: body.username,
            name: body.name,
            email: body.email,
            avatarUrl: body.avatar_url || null,
            emailVerificationState: body.state === 'active' ? 'verified' : 'unverified',
            original: body,
        };
    }
}
exports.GitlabDriver = GitlabDriver;
