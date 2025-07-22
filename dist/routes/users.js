"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.default = (user) => {
    const router = (0, express_1.Router)();
    // GET users listing.
    router.get('/', (req, res, next) => {
        res.send('respond with a resource');
    });
    // POST user creation
    router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received POST request:', req.body);
        try {
            if (!req.body.firstName || !req.body.lastName) {
                return res.status(400).json({ error: 'firstName and lastName are required' });
            }
            const instance = yield user.create({
                id: req.body.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            console.log('Created user:', instance.toJSON());
            res.status(201).json(instance);
        }
        catch (err) {
            console.error('Error creating user:', err);
            res.status(400).json({ error: err.message });
        }
    }));
    return router;
};
