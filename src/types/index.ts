interface EmailPayload {
    from: string;
    to: string;
    subject: string;
    text: string;
    HTML: string;
};

export { EmailPayload }