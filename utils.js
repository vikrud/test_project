function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

function getUser(request) {
    let user = {
        id: null,
        name: request.body.name,
        surname: request.body.surname,
        email: request.body.email,
        phone: request.body.phone,
    };

    if (request.params.id) {
        user.id = request.params.id;
    }

    return user;
}

module.exports = { isEmpty, getUser };
