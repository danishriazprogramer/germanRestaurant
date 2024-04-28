import { Category } from '../../models/admin/category.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

const createCategory = async (req, res) => {
  try {
    const { name, size, isPrimary, isDrink } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, `Category ${name} already exists`);
    }

    const category = await Category.create({ name, size, isPrimary, isDrink });

    res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
  } catch (err) {
    console.log(err);
    if (err instanceof ApiError) {
      return res
        .status(err.statusCode)
        .json(new ApiResponse(err.statusCode, null, err.message));
    } else {
      return res
        .status(500)
        .json(new ApiResponse(500, null, 'Some error while creating category'));
    }
  }
};

export { createCategory };
