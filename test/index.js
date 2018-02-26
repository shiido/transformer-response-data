var should = require('chai').should();
var Transformer = require('../index');

describe('transformer-data-response', function () {

    //user transform
    var userTransformer = new Transformer({
        "id": "_id",
        "name": function (data) {
            return data.firstName + " " + data.lastName;
        }
    });

    describe('Stage data object', function () {

        //data from database or ...
        var dataDatabase1 = {
            "_id": "5a91c4547886436ed94e6326",
            "firstName": "John",
            "lastName": "Doe",
            "password": "$2a$10$VzJQsmaknGuafqXSfzDWg.zPshX..uY26Yn8X9TJnvjGqHex1FQ7S",
        };
        var dataTransformed1 = userTransformer.transformer(dataDatabase1);


        it("should return data with property 'id'", function () {
            dataTransformed1.should.have.property('id');
        });

        it("should return data with property 'name'", function () {
            dataTransformed1.should.have.property('name');
        });

        it("should return data without property 'password'", function () {
            dataTransformed1.should.not.have.property('password');
        });

    });


    describe('Stage data array', function () {

        //data from database or ...
        var dataDatabase2 = [
            {
                "_id": "5a91c4547886436ed94e6326",
                "firstName": "John",
                "lastName": "Doe",
                "password": "$2a$10$VzJQsmaknGuafqXSfzDWg.zPshX..uY26Yn8X9TJnvjGqHex1FQ7S",
            },
            {
                "_id": "5a931bd3bac34d6aa90804dc",
                "firstName": "Homero",
                "lastName": "Simpson",
                "password": "$2a$10$B19Xg/peAH.BK4Z1gV/xJ.2OXvm9kO95W89SYzAxYP7GS26i9mOvy",
            }
        ];
        var dataTransformed2 = userTransformer.transformer(dataDatabase2);

        var count = 1;
        for (var property in dataTransformed2) {
            var item = dataTransformed2[property];
            it("should return item " + count + " without property 'password'", function () {
                item.should.not.have.property('password');
            });
            count++;
        }

    });

});