const { beforeEach, jest, expect, test, describe } = require("@jest/globals");

const AdminModel = require("../model/Admin");

// jest.mock("../controllers/adminControllers",() =>{
//    const originalModule = jest.requireActual("../controllers/adminControllers");

//   return {
//     ...originalModule,
//     createToken: jest.fn(x => x),
//   };
// })
// const {adminLogin_post} = require("../controllers/adminControllers");

const AllAdminController = require("../controllers/adminControllers");

const createTokenJest = jest
  .spyOn(AllAdminController, "createToken")
  .mockImplementationOnce(jest.fn((x) => x));

const { adminLogin_post } = AllAdminController;

const loginMockData = { email: "email", password: "password" };

const request = { body: loginMockData };
const response = { cookie: jest.fn(), status: jest.fn(), json: jest.fn() };
const modelFindOne = (AdminModel.findOne = jest.fn()); //mock single function of module

beforeEach(() => {
  response.json.mockClear();
  response.status.mockClear();
  response.cookie.mockClear();
  createTokenJest.mockClear();
});

describe("admin login", () => {
  test("admin login should failed with wrong password", async () => {
    modelFindOne.mockResolvedValueOnce({ password: "wrong" });

    await adminLogin_post(request, response);

    expect(response.status.mock.calls[0][0]).toBe(400);
    expect(response.json.mock.calls[0][0]).toMatchObject({
      errors: { email: "", password: "Incorrect Password" },
    });
  });

  test("admin login should failed with wrong email", async () => {
    modelFindOne.mockResolvedValueOnce(undefined);

    await adminLogin_post(request, response);

    expect(response.status.mock.calls[0][0]).toBe(400);
    expect(response.json.mock.calls[0][0]).toEqual({
      errors: { email: "Incorrect Email", password: "" },
    });
  });

  test("login success", async () => {
    modelFindOne.mockResolvedValueOnce({...request.body,_id:1});

    await adminLogin_post(request, response);
    expect(createTokenJest.mock.calls).toHaveLength(1)
    expect(createTokenJest.mock.calls[0][0]).toBe(1)//id 1 is received
    expect(createTokenJest.mock.results[0].value).toBe(1) 
    expect(response.status.mock.calls[0][0]).toBe(200);
    expect(response.json.mock.calls[0][0]).toEqual({user: 1})
    expect(response.cookie.mock.calls[0][0]).toEqual('jwt')
    expect(response.cookie.mock.calls[0][1]).toEqual(1)
    expect(response.cookie.mock.calls[0][2]).toEqual({httpOnly: true,maxAge: 259200000})
  });
});
