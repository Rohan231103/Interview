exports.onSuccess = (message, result, res) => {
  res.status(200).json({
    message: message,
    Data: result,
    Status: 200,
    IsSuccess: true,
  });
};

exports.create = (message, res) => {
  res.status(201).json({
    message: message,
    Status: 201,
    IsSuccess: true,
  });
};

exports.onBadRequest = (message, res) => {
  res.status(400).json({
    message: message,
    Data: 0,
    Status: 400,
    IsSuccess: false,
  });
};

exports.unauthorisedRequest = (res) => {
  res.status(401).json({
    message: "Unauthorised Request !",
    Data: 0,
    Status: 401,
    IsSuccess: false,
  });
};

exports.notFoundRequest = (message, res) => {
  res.status(404).json({
    message: message,
    Data: 0,
    Status: 404,
    IsSuccess: false,
  });
};

exports.internalServer = (error, res) => {
  res.status(500).json({
    message: error.message,
    Data: 0,
    Status: 500,
    IsSuccess: false,
  });
};
