interface RequestConfig extends RequestInit {
    baseUrl?: string;
}
/**
 * API wrapper to fetch
 *
 * @param path string
 * @param config RequestConfig
 * @returns Promise
 */
declare function http<T>(path: string, config: RequestConfig): Promise<T>;
/**
 * GET method around http
 *
 * @param path string
 * @param config RequestConfig
 * @returns Promise
 */
declare function get<T>(path: string, config?: RequestConfig): Promise<T>;
/**
 * GET method around http
 *
 * @param path string
 * @param body string
 * @param config RequestConfig
 * @returns Promise
 */
declare function post<T>(path: string, body: Record<string, unknown>, config?: RequestConfig): Promise<T>;

export { RequestConfig, get, http, post };
