export type TemplateToken<Template extends string> = Template extends `${string}/:${infer P}/${infer Rest}`
    ? P | TemplateToken<`/${Rest}`>
    : Template extends `${string}/:${infer P}`
    ? P
    : never;



// urlcat("http://example.com", "org/:orgName/user/:userId", {
//     // @ts-expect-error
//     foo: "bar"
// }); // error! required properties missing
// urlcat("http://example.com", "org/:orgName/user/:userId", {
//     // @ts-expect-error
//     orgname: "SprocketCo",
//     userId: "951d20a0-e188-4db4-a946-df426d3d9e91"
// });
// urlcat("http://example.com", "org/:orgName/user/:userId", {
//     orgName: "SprocketCo",
//     userId: "951d20a0-e188-4db4-a946-df426d3d9e91"
// });
// urlcat("http://example.com", "org/:orgName/user/:userId", {
//     orgName: "SprocketCo",
//     userId: "951d20a0-e188-4db4-a946-df426d3d9e91",
//     sortBy: "sprocketsPerWeek"
// });