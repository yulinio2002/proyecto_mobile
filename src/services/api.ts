// src/services/api.ts
import axios, { AxiosRequestConfig, AxiosResponse,RawAxiosRequestHeaders } from 'axios';

export default class Api {
  private static _instance: Api | null = null;
  private _basePath: string;
  private _authorization: string | null;

  public set authorization(value: string) {
    this._authorization = value;
  }

  private constructor(basePath: string) {
    this._basePath = basePath;
    this._authorization = null;
  }

  public static async getInstance() {
    if (!this._instance) {
      // Para desarrollo local
      const basePath = __DEV__ 
        ? 'http://10.0.2.2:8081' // Android emulator
        : 'https://tu-api-produccion.com';
      
      this._instance = new Api(basePath);
    }
    return this._instance;
  }
  public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const headers: RawAxiosRequestHeaders = {
			"Content-Type": "application/json",
			Authorization: this._authorization ? `Bearer ${this._authorization}` : "",
		};

		const configOptions: AxiosRequestConfig = {
			...config,
			baseURL: this._basePath,
			headers: headers,
		};

		const path = this._basePath + config.url;

		return axios<RequestType, AxiosResponse<ResponseType>>(path, configOptions);
	}

	public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...config,
			method: "GET",
		};

		return this.request<RequestType, ResponseType>(configOptions);
	}

	public post<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "POST",
			data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public delete(options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "DELETE",
		};

		return this.request<void, void>(configOptions);
	}

	public put<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "PUT",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "PATCH",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}
}


  // Resto de métodos igual que en web...
