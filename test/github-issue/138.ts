import urlcat from "../../src";


it("Infer required params from path template", () => {
    expect(() => {
        // @ts-expect-error
        urlcat("http://example.com", "org/:orgName/user/:userId", {
            foo: "bar",
        });
    }).toThrow()

    expect(() => {
        // @ts-expect-error
        urlcat("http://example.com", "org/:orgName/user/:userId", {
            orgname: "SprocketCo",
            userId: "951d20a0-e188-4db4-a946-df426d3d9e91"
        })
    }).toThrow()
    
    expect(() => {
        urlcat("http://example.com", "org/:orgName/user/:userId", {
            orgName: "SprocketCo",
            userId: "951d20a0-e188-4db4-a946-df426d3d9e91"
        });
    }).not.toThrow()

    expect(() => {
        urlcat("http://example.com", "org/:orgName/user/:userId", {
            orgName: "SprocketCo",
            userId: "951d20a0-e188-4db4-a946-df426d3d9e91",
            sortBy: "sprocketsPerWeek"
        });
    }).not.toThrow()
})