import Api from "@services/api";
import {AuthMeDto} from "@interfaces/auth/AuthMeDto.ts";

export async function getMeInfo(): Promise<AuthMeDto> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, AuthMeDto>(
        { url: `/auth/me` }
    );
    return response.data;
}