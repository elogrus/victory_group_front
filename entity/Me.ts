import { CONSTS } from "@/shared/lib/consts";

class MeService {
    private ROUTES = {
        login: CONSTS.API_URL + "/auth/login",
        register: CONSTS.API_URL + "/auth/register",
    };
    async login(login: string, password: string) {
        return true;
    }
    async register(login: string, name: string, password: string) {
        return true;
    }
}
const meService = new MeService();
export default meService;
