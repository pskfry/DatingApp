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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../environments/environment");
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
        this.baseUrl = environment_1.environment.apiUrl;
    }
    UserService.prototype.getUsers = function () {
        var _this = this;
        return this.http.get(this.baseUrl + 'users/users', this.jwt()).pipe(operators_1.map(function (response) { return response.json(); }), operators_1.catchError(function (error) { return _this.handleError(error); }));
    };
    UserService.prototype.jwt = function () {
        var token = localStorage.getItem('token');
        if (token) {
            var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + token });
            headers.append('Content-type', 'application/json');
            return new http_1.RequestOptions({ headers: headers });
        }
    };
    UserService.prototype.handleError = function (error) {
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
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
