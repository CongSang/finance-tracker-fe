export const validateEmail = (email: string) => {
    if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }
    return false
}

export const validatePassword = (password: string) => {
    // Regex: Ít nhất 8 ký tự, 1 chữ cái, 1 số
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
}
