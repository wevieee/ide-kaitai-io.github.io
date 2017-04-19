define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Repository {
        constructor(client, name, owner) {
            this.client = client;
            this.name = name;
            this.owner = owner;
            var nameParts = name.split('/');
            if (nameParts.length === 2) {
                this.owner = nameParts[0];
                this.name = nameParts[1];
            }
        }
        static fromEntity(client, entity) {
            var repo = new Repository(client, entity.full_name);
            repo.entity = entity;
            return repo;
        }
        getContents(path = '/') {
            return this.client.req(`/repos/${this.owner}/${this.name}/contents${path}`);
        }
        downloadFile(path) {
            return downloadFile(`https://raw.githubusercontent.com/koczkatamas/kaitai_struct_formats/master${path}`);
        }
    }
    exports.Repository = Repository;
    class GithubClient {
        constructor(accessToken, owner) {
            this.accessToken = accessToken;
            this.owner = owner;
        }
        req(path) {
            return new Promise((resolve, reject) => $.getJSON(`https://api.github.com${path}?access_token=${this.accessToken}`).then(json => resolve(json), reject));
        }
        listRepos() {
            return this.req('/user/repos').then(repos => repos.map(entity => Repository.fromEntity(this, entity)));
        }
        getRepo(name, owner) {
            return new Repository(this, name, owner || this.owner);
        }
    }
    exports.GithubClient = GithubClient;
});
//# sourceMappingURL=GithubClient.js.map