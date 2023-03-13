describe("process", function () {
    it("should replace env variables with strings", function () {
        expect(process.env.NODE_ENV).to.equal("development");
    });
    
    it("should not error out when accessing an environment variable that doesn't exist", function () {
        expect(() => process).to.not.throw();
        expect(() => process.env).to.not.throw();
        expect(() => process.env.UNKNOWN_VAR).to.not.throw();
    });
});