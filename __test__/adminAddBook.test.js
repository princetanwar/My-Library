const { expect, jest, describe, beforeEach, test } = require("@jest/globals");
const { adminAddBook_post } = require("../controllers/adminControllers");
const BookModel = require("../model/Book");

const bookModelCreateJest = jest.spyOn(BookModel, "create");

const request = { body: { name: "name", description: "description" } };
const response = { cookie: jest.fn(), status: jest.fn(), json: jest.fn() };

beforeEach(() =>{
  jest.clearAllMocks()
})

describe("admin add book", () => {
  test("failed to add book", async () => {
    bookModelCreateJest.mockRejectedValueOnce({ failed: true });

    await adminAddBook_post(request, response);
    
    expect(bookModelCreateJest).toBeCalled()
    expect(response.status.mock.calls[0][0]).toBe(400);
    expect(response.json.mock.calls[0][0]).toStrictEqual({ failed: true });
  });
  
  test('add book success',async() =>{
 

    bookModelCreateJest.mockResolvedValueOnce(request.body)
    await adminAddBook_post(request, response);

    expect(bookModelCreateJest).toBeCalled();
    expect(bookModelCreateJest).toBeCalledWith(request.body);
    expect(response.status.mock.calls[0][0]).toBe(200)
    expect(response.json.mock.calls[0][0]).toEqual(request.body)


  })

});
