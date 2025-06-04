export const success = (message: string, data?: any) => ({
    success: true,
    message,
    data,
});

export const error = (message: string, code?: number) => ({
    success: false,
    message,
    code,
});
  