// prettier-ignore
/**
 * Regex configuration file.
 *
 * @author Irina Marcano.
 * @since  27.12.2024.
 */

// In this section you can configure the regex to validate the inputs

// Regex to validate password
const validatePasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9]).{6,}$/
;

// Regex to validate email
const validateEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export {
    validateEmailRegex, 
    validatePasswordRegex,
};
