import Users from "../../_common/classes/Users.js";

export async function myData() {
    const user = new Users();

    const responseData = await user.me();

    return responseData;
}