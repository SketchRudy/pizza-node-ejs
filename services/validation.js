export function validateForm(data) {

    // Store all the validation errors in an array
    const errors = [ ];

    // Validate first name
    if (!data.firstName || data.firstName.trim() === "") {
        errors.push("First name is required");
    }

    // Validate last name
    if (!data.lastName || data.lastName.trim() === "") {
        errors.push("Last name is required");
    }

    // Validate email 
    if (!data.email || data.email.trim() === "" || data.email.indexOf("@") ===1) {
        errors.push("Email is required and must be valid");
    }

    if (!data.method) {
        errors.push("Select pickup or delivery");
    } else {
        const validOptions = [ "pickup", "delivery" ];
        if (!validOptions.includes(data.method)) {
            errors.push("Go away, evlidoer!");
        }
    }

    if (data.size === "none") {
        errors.push("lease select a size");
    } else {
        const validSizes = [ "small", "medium", "large" ];
        if (!validSizes.includes(data.size)) {
            errors.push("Go away, evlidoer!");
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}