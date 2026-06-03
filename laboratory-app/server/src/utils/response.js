// 200 - request succeeded
const success = (res, data, message = "Success") => {
    return res.status(200).json({ success: true, message, data });
};

// 201 - something was created 
const created = (res, data, message = "Created successfully") => {
    return res.status(201).json({ success: true, message, data });
}

// 400 - bad request, missing or invalid input
const badRequest = (res, message = "Bad request") => {
    return res.status(400).json({ success: false, error: message });
}

// 401 - Not authenticated
const unauthorized = (res, message = "Unauthorized") => {
    return res.status(401).json({ success: false, error: message });
}

// 403 - authenticated but not allowed
const forbidden = (res, message = "Forbidden") => {
    return res.status(403).json({ success: false, error: message });
}

// 404 - route not found
const notFound = (res, message = "Not found") => {
    return res.status(404).json({ success: false, error: message });
}

// 500 - something went wrong on our end
const serverError = (res, message = "Internal server error") => {
    return res.status(500).json({ success: false, error: message });
}

module.exports = {
    success,
    created,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError,
};