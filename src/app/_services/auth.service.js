"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var operators_2 = require("rxjs/operators");
var AuthService = /** @class */ (function () {
    function AuthService(http, jwtHelper) {
        this.http = http;
        this.jwtHelper = jwtHelper;
        this.baseUrl = 'http://localhost:5000/api/auth/';
    }
    AuthService.prototype.login = function (model) {
        var _this = this;
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions())
            .pipe(operators_1.map(function (response) {
            var user = response.json();
            if (user) {
                localStorage.setItem('token', user.value);
                _this.decodedToken = _this.jwtHelper.decodeToken(user.tokenString);
                _this.userToken = user.value;
            }
        }), operators_2.catchError(this.handleError));
    };
    AuthService.prototype.register = function (model) {
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).pipe(operators_2.catchError(this.handleError));
    };
    AuthService.prototype.loggedIn = function () {
        return !this.jwtHelper.isTokenExpired();
    };
    AuthService.prototype.requestOptions = function () {
        var headers = new http_1.Headers({ 'Content-type': 'application/json' });
        return new http_1.RequestOptions({ headers: headers });
    };
    AuthService.prototype.handleError = function (error) {
        var applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return rxjs_1.throwError(error);
        }
        var serverError = error.json();
        var modelStateErrors = '';
        if (serverError) {
            for (var key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return rxjs_1.throwError(modelStateErrors || 'server error');
    };
    AuthService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
