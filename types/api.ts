export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    metadata?: {
        total?: number;
        page?: number;
        limit?: number;
        pages?: number;
    };
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
    statusCode: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
