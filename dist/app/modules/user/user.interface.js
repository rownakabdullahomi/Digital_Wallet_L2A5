"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAgentApproved = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
var IsAgentApproved;
(function (IsAgentApproved) {
    IsAgentApproved["NOT_APPROVED"] = "NOT_APPROVED";
    IsAgentApproved["PENDING"] = "PENDING";
    IsAgentApproved["APPROVED"] = "APPROVED";
    IsAgentApproved["SUSPENDED"] = "SUSPENDED";
})(IsAgentApproved || (exports.IsAgentApproved = IsAgentApproved = {}));
