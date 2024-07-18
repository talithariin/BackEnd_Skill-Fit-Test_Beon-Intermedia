const errorHandler = (err, req, res, next) => {
  let statusCode;
  let message;
  console.log(err.message);
  switch (err.message) {
    case "No_Data_Provided":
      statusCode = 400;
      message = "No data provided for update";
      break;
    case "Error_Disini_Woy":
      statusCode = 404;
      message = "Error disini woy";
      break;
    case "Resident_Not_Found":
      statusCode = 404;
      message = "There are no residents with the requested id";
      break;
    case "House_Not_Found":
      statusCode = 404;
      message = "There are no house with the requested id";
      break;
    case "HouseResident_Not_Found":
      statusCode = 404;
      message = "There are no house resident with the requested id";
      break;
    case "FeeType_Not_Found":
      statusCode = 404;
      message = "There are no fee type with the requested id";
      break;
    default:
      statusCode = 500;
      message = "Internal server error";
      break;
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
