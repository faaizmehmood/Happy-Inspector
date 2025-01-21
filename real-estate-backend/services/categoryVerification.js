import userModel from "../models/userModel.js";

export const PropertyCategoryVerification = async (role, userid) => {
  try {
    const user = await userModel.findById(userid);

    if (!user) {
      throw new Error('User not found');
    }

    if (role === "FREETIER" || role === "STANDARDTIER") {
      // STANDARDTIER users cannot have a category
      // return category === "";
      return false;
    } else if (role === "TOPTIER") {
      const uniqueCategoriesCount = user.propertyCategories ? user.propertyCategories.length : 0;

      if (uniqueCategoriesCount >= 10) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying category privileges:", error);
    return false;
  }
};

