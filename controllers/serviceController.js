// @ts-check
const Service = require("../models/serviceModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
exports.getallService = factory.getAll(Service);
exports.create = factory.createOne(Service);
exports.getService =factory.getOne(Service);
exports.updateService = factory.updateOne(Service);
exports.deleteService = factory.deleteOne(Service);

