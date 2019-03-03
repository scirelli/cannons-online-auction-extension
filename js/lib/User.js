/* exported User */
class User {
    constructor(id, password, isLoggedIn = false) {
        this.id = id;
        this.password = password;
        this.isLoggedIn = isLoggedIn;
    }
}
