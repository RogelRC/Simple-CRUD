const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
}

export default isValidName;