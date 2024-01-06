const { beforeEach, test, describe, expect, jest } = require("@jest/globals");
const { isAdmin } = require("../Middleware/authMiddleware");

const jwt = require("jsonwebtoken");

const jwtVerifyJest = jest.spyOn(jwt, "verify");

let request = { cookies: { jwt: "jwt token" } };

const response = { redirect: jest.fn((x) => x) };
const nextFunction = jest.fn();

beforeEach(() => {
  request = { cookies: { jwt: "jwt token" } };
  jest.clearAllMocks();
});

describe("isAdmin middleware", () => {
  test("verification success", async () => {
    jwtVerifyJest.mockImplementation((_, __, cb) => {
      cb(null, "decoded token");
    });
    isAdmin(request, response, nextFunction);

    expect(nextFunction).toBeCalled();
    expect(nextFunction.mock.calls[0][0]).toBeUndefined();
  });

  test("no token should redirect", () => {
    request.cookies.jwt = "";
    isAdmin(request, response);
    expect(jwtVerifyJest).not.toBeCalled();
    expect(response.redirect).toBeCalled();
    expect(response.redirect.mock.calls).toHaveLength(1);
  });

  test('jwt token expiry',() =>{


	jwtVerifyJest.mockImplementation((_,__,cb) =>{
		cb({message: 'error'})
	})

	isAdmin(request,response);

	expect(jwtVerifyJest).toBeCalled();
	expect(jwtVerifyJest.mock.calls).toHaveLength(1)
	expect(response.redirect.mock.calls).toHaveLength(1);
  })
});
