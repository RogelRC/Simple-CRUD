const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]+$/;

    return phoneRegex.test(phone);
}

export default isValidPhone;