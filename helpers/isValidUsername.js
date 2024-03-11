const isValidUsername = (username) =>{
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
}

export default isValidUsername;