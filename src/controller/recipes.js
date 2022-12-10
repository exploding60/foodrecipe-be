require("dotenv").config();
const ModelRecipes = require("./../model/recipes");
const { response } = require("./../helpers/common");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");

const recipesController = {
  insert: async (req, res) => {
    try {
      // const { id_users } = "a3bc1e68-3d93-459b-8748-56b9e63e228a";
      // const token = req.cookies;
      const id_users = req.payload.id;
      console.log(id_users, "ini id coy");
      const {
        photo: [photo],
        video: [video],
      } = req.files;

      req.body.photo = photo.path;
      req.body.video = video.path;

      await ModelRecipes.addRecipes(req.body, id_users);
      return response(res, 200, true, req.body, "INPUT RECIPES SUCCESS");
    } catch (err) {
      return response(res, 404, false, err, "input data fail");
    }
  },
  update: async (req, res, next) => {
    try {
      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: "toko",
      });
      // getting url for db
      req.body.photo = image.url;

      await ModelRecipes.updateRecipes(req.params.id, req.body);
      return response(res, 200, true, req.body, "UPDATE RECIPES SUCCESS");
    } catch (err) {
      return response(res, 404, false, err, "UPDATE RECIPSE FAILED");
    }
  },
  delete: async (req, res) => {
    try {
      await ModelRecipes.deleteRecipes(req.params.id);
      response(res, 200, true, [], "delete data success");
    } catch (err) {
      response(res, 404, false, err, "delete data faill");
    }
  },
  detail: async (req, res) => {
    try {
      const comments = await ModelRecipes.getComents(req.params.id);
      const recipes = await ModelRecipes.detailRecipes(req.params.id);

      response(res, 200, true, recipes.rows, "GET RECIPES DATA SUCCESS");
      // response(res, 200, true, comments.rows, "GET RECIPES DATA SUCCESS");
    } catch (error) {
      response(res, 404, false, error, "GET DATA FAILED");
    }
  },
  recipeUSer: async (req, res) => {
    try {
      const id = req.payload.id;
      console.log(id, "ini id coy");
      console.log(id, "ini id");
      const result = await ModelRecipes.recipeUsers(id);
      response(res, 200, true, result.rows, "INPUT DATA SUKSES");
    } catch (error) {
      response(res, 404, false, error, "GET DATA FAILED");
    }
  },
  addComents: async (req, res) => {
    try {
      const result = await ModelRecipes.addComents(req.body);
      response(res, 200, true, [], "INPUT COMMENT SUCCESS");
    } catch (error) {
      response(res, 404, false, error, "INPUT COMMENT FAILED");
    }
  },
  addBookmark: async (req, res) => {
    try {
      const result = await ModelRecipes.saveRecipes(req.body);
      response(res, 200, true, [], "RECIPES SAVED");
    } catch (error) {
      response(res, 404, false, error, "SAVING RECIPES FAILED");
    }
  },
  sort: async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const sortby = req.query.sortby || "recipes_name";
      const sort = req.query.sort || "ASC";
      const search = req.query.search || "";
      const result = await ModelRecipes.sort({
        limit,
        offset,
        sort,
        sortby,
        search,
      });
      response(res, 200, true, result.rows, "get data success");
    } catch (err) {
      console.log(err);
      response(res, 404, false, err, "get data fail");
    }
  },
};

exports.recipesController = recipesController;
