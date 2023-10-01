interface EmailPayload {
    from: string;
    to: string;
    subject: string;
    text: string;
    HTML: string;
};

interface TokenSigningPayload {
    id: number;
    name: string;
    email: string;
};

interface DecodedTokenData {
    id: number;
    name: string;
    email: string;
    iat: number
    exp: number
};

export { EmailPayload, TokenSigningPayload, DecodedTokenData }